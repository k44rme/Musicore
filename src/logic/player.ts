import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Config, MusicFile } from "../structs";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";

type Player = {
  index: number,
  file: MusicFile[]
}

function player() {
  const location = useLocation();
  const song = location.state as Player | undefined;
  const [config, setConfig] = useState<Config | null>(null);
  const [_, setReady] = useState(false);

  const file = song?.file[song.index]

  useEffect(() => {
    let cancelled = false;
    const loadAudio = async () => {
      try {
        if (config == null ) {
          let result = await invoke<string>("read_config");
          if(!cancelled) setConfig(JSON.parse(result))
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    loadAudio()

    return () => {
      cancelled = true
    }
  }, [config])

  const initialize_song = (file_name: string): string => {
    if (!config || !file) return "";
    if (!config.music_path || !file.file_name) {
      console.error("Missing music_path or file_name", {
        music_path: config.music_path,
        file_name: file.file_name,
      });
      return "";
    }
    try {
      const fullPath = `${config.music_path}/${file_name}`;

      const assetUrl = convertFileSrc(fullPath);

      let asset = sessionStorage.setItem("audio", assetUrl)

      let audio = sessionStorage.getItem("audio")
      let audioURL: string | undefined = audio === null ? undefined : audio;
      let assetURL: string = asset ?? "";
    
      if (audioURL != asset)  {
        sessionStorage.setItem("audio", assetURL)
      }

      return audioURL ?? ""
      
    } catch (error) {
      console.error("Failed to convert file path:", error);
      return "";
    }
    
  };
  
  const audio_actions = (audio_ref: React.RefObject<HTMLAudioElement | null>, action: string) => {
    let audio: HTMLAudioElement = audio_ref?.current ?? document.createElement("audio")
    switch (action) {
      case "play":
        audio.play();
        break
      case "pause": 
        audio.pause();
        break;
      case "get_currentTime":
        return audio.currentTime
      case "get_duration": 
        return audio.duration
      case "is_paused":
        return audio.paused
    }
  }

  return {
    init: initialize_song,
    actions: audio_actions,
    song: song,
    file: file
  }
}

export default player