import { useLocation } from "react-router-dom";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Config, MusicFile } from "../structs"

function PlayerPage() {
  const location = useLocation();
  const file = location.state as MusicFile | undefined;
  const [config, setConfig] = useState<Config | null>(null);
  const [_, setReady] = useState(false);
  const [asset, setAsset] = useState<string>();

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

  useEffect(() => {
    if (!config || !file) return;
    if (!config.music_path || !file.file_name) {
      console.error("Missing music_path or file_name", {
        music_path: config.music_path,
        file_name: file.file_name,
      });
      return;
    }
    try {
      const fullPath = `${config.music_path}/${file.file_name}`;
      console.log("Setting audio path:", fullPath);

      const assetUrl = convertFileSrc(fullPath);
      console.log("Converted URL:", assetUrl);

      sessionStorage.setItem("audio", assetUrl)
      setAsset(assetUrl)
      
    } catch (error) {
      console.error("Failed to convert file path:", error);
    }
    
  }, [config, file]);
  
  let audio = sessionStorage.getItem("audio")
  let audioURL: string | undefined = audio === null ? undefined : audio;
  let assetURL: string = asset ?? "";

  if (audio != asset)  {
    sessionStorage.setItem("audio", assetURL)
  }

  return (
    <audio controls src={audioURL} className="player" />
  );
}

export default PlayerPage;