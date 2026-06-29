use std::{fmt::Debug, fs};

use serde_json::{self, Value};
use crate::config;
use toml_edit::{self, DocumentMut};

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
        path = config::create_config(exe_dir);
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
            return "".to_string();
        }
    }
}

#[tauri::command]
pub fn edit_profile(prop: String, val: &str) {
    let path = std::env::current_exe().unwrap()
        .parent()
        .unwrap()
        .join("musicore.config.toml");

    if !path.exists() {
        config::create_config(path.to_path_buf());
    }

    let content = std::fs::read_to_string(&path).unwrap();
    let mut doc = content.parse::<DocumentMut>().expect("Failed to parse file content");

    if prop == "nickname" {
        doc["profile"]["nickname"] = val.into()
    } else if prop == "avatar" {
        doc["profile"]["avatar"] = val.into();
    } else if prop == "banner" {
        doc["profile"]["banner"] = val.into();
    } else {
        eprint!("Failed to find specific prop");
    }

    std::fs::write(path, doc.to_string())
        .map_err(|err| eprint!("Failed to write data: {}", err));

}