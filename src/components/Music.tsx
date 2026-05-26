import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "@css/MainPage-music.css";
import { Link } from "react-router-dom";
import "../structs"
import { Config, MusicFile } from "../structs";

function Music() {
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [config, setConfig] = useState<Config>();
  const [ready, setReady] = useState(false);
  const [path, setPath] = useState("");

  useEffect(() => {
    const cancelled = false

    const createConfig = async () => {
      try {
        const res = await invoke<string>("create_config")
        setConfig(JSON.parse(res))
      } catch (e) {
        console.log(e);
      }
    }

    const loadConfig = async () => {
      try {
        const res = await invoke<string>("read_config")
        if (res == "err") {
          createConfig()
        }
        if(!cancelled && res != "err") setConfig(JSON.parse(res))
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
        if (config.music_path != "") {
          const result = await invoke<string>("get_music_files", { 
            musicPath: config?.music_path,
          });
          setMusic(JSON.parse(result));
        }
      } catch (err) {
        console.error("Failed to load music:", err);
      }
    };
    
    loadMusic();
  }, [ready, config])
  
  if (config?.music_path == "") {
    return (
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "300px" }}>
        Путь до вашей папки с музыкой?
        <form>
          <input type="text" name="music" id="set-music-path" value={path} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPath(e.target.value)
          }} />
          <button type="submit" onClick={(e) => {
            e.preventDefault()
            const newMusicPath = async () => {
              try {
                invoke("edit_config", {
                  newMusicPath: path
                })
                window.location.reload()
                
              } catch (error) {
                console.error(error)
              }
            }

            newMusicPath()
          }}>OK</button>
        </form>
      </div>
    )
  } else {
    return (
      <div className="song-list">
        {
          music.map((file: MusicFile, index) => {
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
          })
        }
      </div>
    );
  }
}

export default Music;