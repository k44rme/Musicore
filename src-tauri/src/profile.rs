use std::fmt::Debug;

use serde_json::{self, Value};
use crate::config;

#[tauri::command]
pub fn get_profile_info() -> String {
    let exe_dir = std::env::current_exe()
        .map_err(|e| format!("Failed to get executable path: {}", e)).unwrap()
        .parent()
        .ok_or("No parent directory").unwrap()
        .to_path_buf();

    println!("Config file was found");
    let _config = exe_dir.join("musicore.config.toml");
    println!("File exists? {}", &_config.exists());
    let path;

    if !_config.exists() {
        path = config::create_config();
    } else {
        path = _config.to_string_lossy().to_string();
    }

    println!("Successfully converted to string: {}", &path.to_string());

    let content = std::fs::read_to_string(&path).expect("Failed to read file");

    let config: config::Config = toml::from_str(&content)
        .expect("Failed to parse TOML");

    let profile = config.profile;
    println!("Profile got correctly");
    
    let profile = config::Profile {
        nickname: profile.nickname.to_string(),
        avatar: profile.avatar.to_string(),
        banner: profile.banner.to_string(),
    };

    match serde_json::to_string(&profile) {
        Ok(res) => {
            println!("{}", res.to_string());
            res
        },
        Err(err) => {
            println!("{}", err);
            std::process::exit(1);
        }
    }
}