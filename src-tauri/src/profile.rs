use std::{ fmt::Debug, fs };

use serde_json::{ self, Value };
use crate::config;
use toml_edit::{ self, DocumentMut };

#[tauri::command]
pub fn get_profile_info(app: tauri::AppHandle) -> String {
	let dir = config::get_config_path(app).unwrap();

	let _config = dir.join("musicore.config.toml");
	let path;

	if !_config.exists() {
		path = config::create_config(dir);
	} else {
		path = _config.to_string_lossy().to_string();
	}

	let content = std::fs::read_to_string(&path).expect("Failed to read file");

	let config: config::Config = toml::from_str(&content).expect("Failed to parse TOML");

	let profile = config.profile;

	let profile = config::Profile {
		nickname: profile.nickname.to_string(),
		avatar: profile.avatar.to_string(),
		banner: profile.banner.to_string(),
	};

	match serde_json::to_string(&profile) {
		Ok(res) => { res }
		Err(err) => {
			println!("{}", err);
			return "".to_string();
		}
	}
}

#[tauri::command]
pub fn edit_profile(prop: String, val: &str, app: tauri::AppHandle) {
	let path = config::get_config_path(app)
		.unwrap()
		.join("musicore.config.toml")
		.to_string_lossy()
		.to_string();

	/* if !path.exists() {
        config::create_config(path.to_path_buf());
    } */

	let content = std::fs::read_to_string(&path).unwrap();
	let mut doc = content.parse::<DocumentMut>().expect("Failed to parse file content");

	if prop == "nickname" {
		doc["profile"]["nickname"] = val.into();
	} else if prop == "avatar" {
		doc["profile"]["avatar"] = val.into();
	} else if prop == "banner" {
		doc["profile"]["banner"] = val.into();
	} else {
		eprint!("Failed to find specific prop");
	}

	std::fs::write(path, doc.to_string()).map_err(|err| eprint!("Failed to write data: {}", err));
}
