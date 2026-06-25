// This file contains only structures of toml file

use serde::{ Deserialize, Serialize };
use toml_edit::DocumentMut;
use std::fs;
#[cfg(dev)]
use std::fmt::format;

#[derive(Deserialize, Debug, Serialize)]
pub struct Config {
	#[serde(rename = "music_path")]
	pub music_path: String,
	#[serde(rename = "profile")]
	pub profile: Profile,
}


#[derive(Deserialize, Debug, Serialize)]
pub struct Profile {
	pub avatar: String, // Path to avatar
	pub banner: String, // Path to banner
	pub nickname: String, // User nickname
}

impl Default for Config {
	fn default() -> Self {
		Self {
			music_path: String::new(),
			profile: Profile {
				avatar: String::new(),
				banner: String::new(),
				nickname: String::new()
			},
		}
	}
}

// Functions starts here
#[tauri::command]
pub fn create_config() -> String {
	let path = std::env::current_exe().unwrap();
	let config = path
		.join("musicore.config.toml");

	println!("path: {}", config.display());

	let content = fs::read_to_string(config).expect("Cannot get config content");

	let file_name = format!("{}/{}", path.to_string_lossy().to_string(), "musicore.config.toml");
	fs::write(&file_name, &content);

	println!("Wrote config file with content: {}", content);
	file_name
}

#[tauri::command]
pub fn edit_music_path(new_music_path: &str) -> Result<(), String> {
	// Get executable directory
	#[cfg(dev)]
	let exe_dir = std::env
		::current_exe()
		.map_err(|e| format!("Failed to get executable path: {}", e))?
		.parent()
		.unwrap()
		.to_path_buf();

	#[cfg(not(dev))]
	let exe_dir = std::env::current_exe()
		.map_err(|e| format!("Failed tp get executable path: {}", e))?
		.join("/_up_")
		.to_path_buf();

	let config_path = exe_dir.join("musicore.config.toml");
	println!("Config path: {:?}", config_path);
	println!("Config exists before: {}", config_path.exists());

	if !config_path.exists() {
		create_config();
	}

	// Read existing file
	let contents = fs
		::read_to_string(&config_path)
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

	let verify = fs
		::read_to_string(&config_path)
		.map_err(|e| format!("Failed to verify: {}", e))?;

	Ok(())
}

#[tauri::command]
pub fn read_config() -> Result<String, std::string::String> {
	
	let dir = std::env
		::current_exe()
		.map_err(|e| format!("Failed to get executable path: {}", e))?
		.parent()
		.unwrap()
		.to_path_buf();

	println!("{}", dir.display());

	let err: String = "err".to_string();
	let path = match fs::read_to_string(dir.join("musicore.config.toml")) {
		Ok(c) => c,
		Err(_) => {
			return Err(err);
		}
	};
	let config: Config = toml::from_str(&path).unwrap();

	serde_json::to_string(&config).map_err(|e| e.to_string())
}

