
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![allow(warnings)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod music;
mod config;

use std::{fs, path::PathBuf, process};
use dunce;
use serde_json;

use toml_edit::DocumentMut;

#[tauri::command]
fn edit_config(new_music_path: &str) -> Result<(), String> {

    // Read existing file
    let contents = fs::read_to_string("musicore.config.toml").unwrap_or_else(|err| {
      println!("Error while finding the config.toml file. Error: ");
      return err.to_string();
    });
    let mut doc = contents.parse::<DocumentMut>().unwrap();
    
    // Edit the music_path value
    doc["music_path"] = toml_edit::value(new_music_path);
    
    // Write back (preserves comments and formatting)
    fs::write("musicore.config.toml", doc.to_string());
    
    Ok(())
}

#[tauri::command]
async fn read_file(path: String) -> Result<Vec<u8>, String> {
  match std::fs::read(&path) {
    Ok(data) => Ok(data),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
fn read_config() -> Result<String, std::string::String> {
  let path = dunce::canonicalize(PathBuf::from("musicore.config.toml")).unwrap();
  let contents = fs::read_to_string(path.to_string_lossy().to_string()).unwrap();
  let _config: config::Config = toml::from_str(&contents).unwrap();

  serde_json::to_string(&_config).map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![music::get_music_files, read_file, read_config, edit_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}