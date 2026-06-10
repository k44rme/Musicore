import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { MusicFile, Config } from "../structs";

function music() {
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [config, setConfig] = useState<Config>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cancelled = false

    const loadConfig = async () => {
      try {
        const res = await invoke<string>("read_config")
        if(!cancelled && res != "err") setConfig(JSON.parse(res))
        console.log("Config was found");
        
      } catch (e) {
        console.log(e)
      }
    }

    loadConfig();
    setReady(true)
  }, []);

  console.log("Config:", config);
  
  useEffect(() => {
    if (!ready || !config) return;

    const loadMusic = async () => {
      try {
        const music_path = config.music_path ?? ""
        const result = await invoke<string>("get_music_files", { 
          musicPath: music_path,
        });
        setMusic(JSON.parse(result));
        console.log("Music loaded");
      } catch (err) {
        console.error("Failed to load music:", err);
      }
    };
    
    loadMusic();
  }, [ready, config])

  console.log("Music:", music);

  return {
    config: config,
    music: music
  }
}

export default music;
