// Thanks a lot to syedhussim who can help me with code
// Original code: https://github.com/syedhussim/music-player-app/blob/main/src/main.rs

use base64::prelude::*;
use id3::{Tag, TagLike};
use serde_json;
use std::fs;

#[tauri::command]
pub fn get_music_files(music_path: std::path::PathBuf) -> Result<std::string::String, String> {
    let path = music_path.to_string_lossy().to_string();
    let mut files: Vec<MusicFile> = Vec::new();

    let _dir = match fs::read_dir(&path) {
        Ok(v) => v,
        Err(_) => return Err("Fail".to_string()),
    };

    for i in _dir {
        let dir = i.as_ref().unwrap().path().display().to_string();
        let file_name = dir.replace(&path, "").replace("/", "").replace("\\", "");
        let x = i.unwrap().file_type().unwrap().is_file();

        if x && file_name.ends_with(".mp3") {
            let id = rand::random::<u8>();
            let id = format!("{:03}", id);
            let path = format!("{}/{}", music_path.to_string_lossy().to_string(), file_name);
            let tag = Tag::read_from_path(&path).unwrap();
            let title = tag.title().unwrap().to_string();
            let artist = tag
                .artist()
                .or_else(|| Some("Unknown"))
                .unwrap()
                .to_string();
            let duration = mp3_duration::from_path(&path).unwrap();

            let secs = duration.as_secs();
            let hours = secs / 3600;
            let minutes = (secs % 3600) / 60;
            let seconds = secs % 60;
            let seconds = format!("{:02}", seconds);
            let dur;

            if hours > 0 {
                dur = hours.to_string() + ":" + &minutes.to_string() + ":" + &seconds.to_string();
            } else {
                dur = minutes.to_string() + ":" + &seconds.to_string();
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
                durationNum: secs,
                image: img,
                path: path.clone(),
            };

            files.push(song);
        }
    }

    serde_json::to_string(&files).map_err(|e| e.to_string())
}

#[derive(serde::Serialize)]
pub struct MusicFile {
    id: String,
    file_name: String,
    title: String,
    artist: String,
    duration: String,
    durationNum: u64,
    image: String,
    path: String,
}

mod tests {
    use super::*;

    #[test]
    #[ignore = "because the output is very large"]
    fn test_music_files() {
        println!("{:#?}", get_music_files("C:/Users/K44rm/Music".into()))
    }
}
