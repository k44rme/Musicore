
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![allow(warnings)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod music;
mod config;
mod profile;
mod cache;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            music::get_music_files, 
            config::read_config, config::edit_music_path, config::create_config,
            profile::get_profile_info,
            /* cache::create_cache */
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}