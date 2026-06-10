import { invoke } from "@tauri-apps/api/core";
import { Link } from "react-router-dom";
import "../structs"
import { MusicFile } from "../structs";
import music_fn from "../logic/music";
import { useState } from "react";

function Music() {
  const [path, setPath] = useState("");
  
  let mus = music_fn();
  let config = mus.config
  let music: MusicFile[] = mus.music

  let music_path: String = config?.music_path ?? ""
  console.log("music path:", music_path);

  if (music_path == "") {
    console.log("The from");
    setTimeout(() => {
      return (
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "300px" }}>
          <p style={{textAlign: "center"}}>Путь до вашей папки c музыкой?</p>
          <form className="find-music">
            <input type="text" name="music" id="set-music-path" value={path} placeholder="C:/Users/...." onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPath(e.target.value)
            }} />
            <button type="submit" onClick={(e) => {
              e.preventDefault()
              const newMusicPath = async () => {
                try {
                  await invoke("edit_music_path", {
                    newMusicPath: path
                  })
                  window.location.reload();
                  
                } catch (error) {
                  console.error(error)
                }
              }
  
              newMusicPath()
            }}>OK</button>
          </form>
        </div>
      )
    }, 1000)
  } else if (music_path != "") {
    console.log("Config found, music loading...");
    
    return (
      <div className="song-list">
        {
          music.map((file: MusicFile, index) => {
            let queue = {
              index: index,
              file: music
            }
            
            let song = "song song-"+index+1;
            return(
              <Link to={`/play/${file.id}`} key={file.file_name} state={queue} className="song-link">
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