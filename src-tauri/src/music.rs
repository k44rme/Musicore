// Thanks a lot to syedhussim who can help me with code
// Original code: https://github.com/syedhussim/music-player-app/blob/main/src/main.rs

use std::{fs};
use id3::{Tag, TagLike};
use serde_json;
use base64::prelude::*;
use tauri::{Manager, Url};

#[tauri::command]
pub fn get_music_files(music_path: &str) -> Result<std::string::String, String>  {

    let path = String::from(music_path);
    let mut files: Vec<MusicFile> = Vec::new();
    let _dir = fs::read_dir(&path).unwrap();

    for i in _dir {

        let dir = i.as_ref().unwrap().path().display().to_string();
        let file_name = dir.replace(&path, "").replace("/", "").replace("\\", "");
        let x = i.unwrap().file_type().unwrap().is_file();

        if x && file_name.ends_with(".mp3") {
            let id = rand::random::<u8>();
            let id = format!("{:04}", id);
            let path = format!("{}/{}", music_path, file_name);
            let tag = Tag::read_from_path(&path).unwrap();
            let title = tag.title().unwrap().to_string();
            let artist = tag.artist().or_else(|| { Some("Unknown") }).unwrap().to_string();
            let duration = mp3_duration::from_path(&path).unwrap();

            let secs = duration.as_secs();
            let hours = secs / 3600;
            let minutes = (secs % 3600) / 60;
            let seconds = secs % 60;
            let seconds = format!("{:02}", seconds);
            let dur;

            if hours > 0 {
                dur = hours.to_string()+":"+&minutes.to_string()+":"+&seconds.to_string();
            } else {
                dur = minutes.to_string()+":"+&seconds.to_string();
            }
            let mut pics = tag.pictures();
            let mut img = String::new();

            if let Some(pic) = pics.next() {
                img = BASE64_STANDARD.encode(&pic.data);
            }

            let song = MusicFile {
                id: id.to_string(),
                file_name: file_name.to_string(),
                title: title.to_string(),
                artist: artist.to_string(),
                duration: dur.to_string(),
                image: img,
                path: path.clone(),
                converted: convert_file_src(&path).unwrap()
            };

            files.push(song);
        }
        
    }

    serde_json::to_string(&files).map_err(|e| e.to_string())
}

fn convert_file_src(path: &str) -> Result<String, String> {
    // Normalize the path (handle Windows backslashes)
    let normalized = path.replace('\\', "/");
    
    // Create a file:// URL
    let url = format!("https://asset.localhost/{}", normalized.trim_start_matches('/'));
    
    // Validate it's a proper URL
    Url::parse(&url)
        .map(|_| url)
        .map_err(|e| format!("Invalid path: {}", e))
}

#[derive(serde::Serialize)]
pub struct MusicFile {
    id: String,
    file_name: String,
    title: String,
    artist: String,
    duration: String,
    image: String,
    path: String,
    converted: String
}

mod tests {
    use crate::music::get_music_files;

    #[test]
    fn test_music_files() {
        println!("{:#?}", get_music_files("C:/Users/K44rm/Music"))
    }
}