use std::fmt::Debug;

use serde_json::{self, Value};
use crate::config;
use toml_edit;

#[tauri::command]
pub fn get_profile_info() -> String {
    let exe_dir = std::env::current_exe()
        .map_err(|e| format!("Failed to get executable path: {}", e)).unwrap()
        .parent()
        .ok_or("No parent directory").unwrap()
        .to_path_buf();

    let _config = exe_dir.join("musicore.config.toml");
    let path;

    if !_config.exists() {
        path = config::create_config();
    } else {
        path = _config.to_string_lossy().to_string();
    }

    let content = std::fs::read_to_string(&path).expect("Failed to read file");

    let config: config::Config = toml::from_str(&content)
        .expect("Failed to parse TOML");

    let profile = config.profile;
    
    let profile = config::Profile {
        nickname: profile.nickname.to_string(),
        avatar: profile.avatar.to_string(),
        banner: profile.banner.to_string(),
    };

    match serde_json::to_string(&profile) {
        Ok(res) => {
            res
        },
        Err(err) => {
            println!("{}", err);
            std::process::exit(1);
        }
    }
}

#[test]
pub fn edit_profile() {
    let prop = "nickname".to_string();

    let path = std::env::current_exe().expect("Cannot find a path")
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("musicore.config.toml");
    println!("{}", path.display());

    if !path.exists() {
        config::create_config();
    }

    let content = std::fs::read_to_string(path).unwrap();
    let mut config: config::Config = toml::from_str(&content).expect("Failed to get the toml from string");

}