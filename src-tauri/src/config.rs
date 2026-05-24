// This file contains only structers of toml file
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Serialize)]
pub struct Config {
    #[serde(rename="music_path")]
    pub music_path: String,
    #[serde(rename="profile")]
    pub user_profile: Profile,
}

#[derive(Deserialize, Debug, Serialize)]
pub struct Profile {
    pub avatar: String,  // Path to avatar
    pub banner: String,  // Path to banner
    pub nickname: String,  // User nickanme
}