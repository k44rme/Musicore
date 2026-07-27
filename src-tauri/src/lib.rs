// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![allow(warnings)]
use tauri::fs::Scope;
use tauri_plugin_fs::FsExt;

mod cache;
mod config;
mod music;
mod profile;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            music::get_music_files,
            config::read_config,
            config::edit_music_path,
            config::create_config,
            config::get_music,
            profile::get_profile_info,
            profile::edit_profile /* cache::create_cache */
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
