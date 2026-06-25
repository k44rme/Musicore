
use crate::{config::Profile, profile::get_profile_info};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Cache {
    profile: Profile,

}

/* #[tauri::command]
pub fn create_cache(path: &str) /* -> std::path::PathBuf */ {
    let content: Cache = Cache {
        profile: 
    }
} */