// This file contains only structures of toml file

use serde::{Deserialize, Serialize};
use serde_json::Error;
use std::{fs, path::PathBuf};
use tauri::Manager;
use toml_edit::DocumentMut;

#[derive(Deserialize, Debug, Serialize)]
pub struct Config {
    #[serde(rename = "music_path")]
    pub music_path: String,
    #[serde(rename = "profile")]
    pub profile: Profile,
}

#[derive(Deserialize, Debug, Serialize)]
pub struct Profile {
    pub avatar: String,   // Path to avatar
    pub banner: String,   // Path to banner
    pub nickname: String, // User nickname
}

impl Default for Config {
    fn default() -> Self {
        Self {
            music_path: String::new(),
            profile: Profile {
                avatar: String::new(),
                banner: String::new(),
                nickname: String::new(),
            },
        }
    }
}

#[tauri::command]
pub fn get_config_path(app: tauri::AppHandle) -> Result<PathBuf, tauri::Error> {
    let path = app
        .path()
        .document_dir()
        .expect("Failed to get document dir")
        .join("Musicore/");

    println!("{}", path.display());
    Ok(path)
}

// Functions starts here
#[tauri::command]
pub fn create_config(dir: PathBuf) -> String {
    let config_path = dir.join("musicore.config.toml");
    println!("Config path: {}", config_path.display());

    let content = if config_path.exists() {
        fs::read_to_string(&config_path).expect("Failed to read config file")
    } else {
        let default = String::from_utf8_lossy(include_bytes!("../../musicore.config.toml"));
        fs::write(&config_path, default.to_string()).expect("Failed to create default config");
        default.to_string()
    };

    println!("Config content: {}", content);
    config_path.to_string_lossy().to_string()
}

#[tauri::command]
pub fn edit_music_path(new_music_path: &str, app: tauri::AppHandle) -> Result<(), String> {
    let dir = get_config_path(app).unwrap();

    let config_path = dir.join("musicore.config.toml");
    println!("Config path: {:?}", config_path);
    println!("Config exists before: {}", config_path.exists());

    if !config_path.exists() {
        create_config(dir);
    }

    // Read existing file
    let contents = fs::read_to_string(&config_path)
        .map_err(|e| format!("Error reading config from {:?}: {}", config_path, e))?;

    // Parse TOML
    let mut doc = contents
        .parse::<DocumentMut>()
        .map_err(|e| format!("Failed to parse TOML: {}", e))?;

    // Check current value
    if let Some(current) = doc.get("music_path") {
        println!("Current music_path: {:?}", current.as_str());
    }

    // Edit the music_path value
    doc["music_path"] = toml_edit::value(new_music_path);

    if let Some(updated) = doc.get("music_path") {
        println!("New music_path value: {:?}", updated.as_str());
    }

    let new_contents = doc.to_string();

    fs::write(&config_path, &new_contents)
        .map_err(|e| format!("Failed to write config to {:?}: {}", config_path, e))?;

    let verify =
        fs::read_to_string(&config_path).map_err(|e| format!("Failed to verify: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn read_config(app_handle: tauri::AppHandle) -> Result<String, std::string::String> {
    let config = get_config_path(app_handle)
        .unwrap()
        .join("musicore.config.toml");

    if !config.exists() {
        create_config(config.parent().unwrap().to_path_buf());
    }

    let err: String = "err".to_string();
    let path = match fs::read_to_string(config) {
        Ok(c) => c,
        Err(_) => {
            return Err(err);
        }
    };
    let config: Config = toml::from_str(&path).unwrap();

    serde_json::to_string(&config).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_music(app_handle: tauri::AppHandle) -> String {
    let config_content = read_config(app_handle.clone()).unwrap();

    let doc: DocumentMut = match config_content.parse() {
        Ok(doc) => doc,
        Err(e) => {
            eprintln!("Failed to parse TOML: {}", e);
            return app_handle
                .clone()
                .path()
                .audio_dir()
                .expect("Failed tp get music directory")
                .to_string_lossy()
                .to_string();
        }
    };

    if let Some(current) = doc.get("music_path") {
        println!("Current music_path: {:?}", current.as_str());
    }

    let music_path = doc["music_path"].to_string();

    if music_path != "" {
        music_path
    } else {
        app_handle
            .path()
            .audio_dir()
            .expect("Failed to get directory with music")
            .to_string_lossy()
            .to_string()
    }
}

mod tests {
    use crate::config::create_config;

    #[test]
    #[ignore = "because I don't wanna create new config"]
    fn test_create_config() {
        println!(
            "{:?}",
            create_config(
                std::env::current_exe()
                    .unwrap()
                    .parent()
                    .unwrap()
                    .to_path_buf()
            )
        )
    }
}
