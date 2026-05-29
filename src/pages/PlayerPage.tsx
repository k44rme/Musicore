import { useLocation } from "react-router-dom";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import React, { useEffect, useRef, useState } from "react";
import { Config, MusicFile } from "../structs"

type Player = {
  index: number,
  file: MusicFile[]
}

function PlayerPage() {
  const location = useLocation();
  const song = location.state as Player | undefined;
  const [config, setConfig] = useState<Config | null>(null);
  const [_, setReady] = useState(false);
  const audio_el = useRef<HTMLAudioElement>(null)

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

  const track: string = song?.file[song.index].file_name ?? ""

  return (
    <>
      <h1>{file?.file_name}</h1>
      <audio controls src={initialize_song(track)} className="player-music" ref={audio_el} />
      <button onClick={() => {
        let index: number = song?.index ?? 0
        let previous_track: string = song?.file[index-1].file_name ?? ""

        console.log({index: index, next_track: previous_track})

        if (index >= 0 && audio_el.current) {
          let audio: HTMLAudioElement = audio_el.current ?? null;
          audio.src = initialize_song(previous_track)
          audio.load()
        }
      }}>prev</button>
      
      <button onClick={() => {
        if (audio_actions(audio_el, "is_paused")) {
          audio_actions(audio_el, "play")
        } else {
          audio_actions(audio_el, "pause")
        }
      }}>play/pause</button>

      <button onClick={() => {
        let index: number = song?.index ?? 0
        let next_track: string = song?.file[index+1].file_name ?? ""
        let queue_len: number = song?.file.length ?? 0

        console.log({index: index, next_track: next_track, queue_len: queue_len})

        if (index <= queue_len && audio_el.current) {
          let audio: HTMLAudioElement = audio_el.current ?? null;
          audio.src = initialize_song(next_track)
          audio.load()
        }
      }}>next</button>
    </>
  );
}

export default PlayerPage;