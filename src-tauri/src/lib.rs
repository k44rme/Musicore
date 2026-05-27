
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![allow(warnings)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod music;
mod config;

use std::{fs, path::PathBuf, process};
use dunce;
use serde_json;

use toml_edit::DocumentMut;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![music::get_music_files, config::read_config, config::edit_config, config::create_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}