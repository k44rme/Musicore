import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../assets/css/MainPage-music.css";
import { Link } from "react-router-dom";
import "../structs"
import { Config, MusicFile } from "../structs";

function Music() {
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [config, setConfig] = useState<Config>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cancelled = false

    const loadConfig = async () => {
      try {
        const res = await invoke<string>("read_config")
        if(!cancelled) setConfig(JSON.parse(res))
      } catch (e) {
        console.log(e)
      }
    }

    loadConfig();
    setReady(true)
  }, []);
  
  useEffect(() => {
    if (!ready || !config) return;

    const loadMusic = async () => {
      try {
        const result = await invoke<string>("get_music_files", { 
          musicPath: config?.music_path,
        });
        setMusic(JSON.parse(result));
      } catch (err) {
        console.error("Failed to load music:", err);
      }
    };
  
    loadMusic();
  }, [ready, config])

  return (
    <div className="song-list">
      {music.map((file: MusicFile, index) => {
        let song = "song song-"+index+1;
        return(
          <Link to={`/play/${file.id}`} key={file.file_name} state={file} className="song-link">
            <div className={song} key={index}>
                <img className="song-cover" src={"data:image/png;base64, "+file.image} alt="" />
                <div className="song-info">
                  <h3 className="song-title">{file.title}</h3>
                  <p className="song-artist" >{file.artist}</p>
                </div>
                  <span className="song-duration">{file.duration}</span>
            </div>
          </Link>
        )
      })}
    </div>
  );
}

export default Music;