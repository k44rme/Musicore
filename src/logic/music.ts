import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { MusicFile } from "../structs";

function music() {
	const [music, setMusic] = useState<MusicFile[]>([]);
	const [path, setPath] = useState<string>();
	const [ready, setReady] = useState(false);
	const [err, setErr] = useState("");

	useEffect(() => {

		const loadConfig = async () => {
			try {
				const res = await invoke<string>("get_music");
				setPath(res);
				console.log("Config was found");
			} catch (e) {
				console.log(e);
			}
		};

		loadConfig();
		setReady(true);
	}, []);

	console.log("Config:", path);

	let music_path;
	useEffect(() => {
		if (!ready || !path) return;

		const loadMusic = async () => {
			try {
				const result = await invoke<string>("get_music_files", {
					musicPath: path,
				});
				setMusic(JSON.parse(result));
				console.log("Music loaded");
			} catch (err) {
				console.warn("Failed to load music:", err);
				setErr("Failed to load music");
				console.log(err);
			}
		};

		loadMusic();
	}, [ready, path]);

	console.log("Music:", music);

	return {
		config: path,
		music: music,
		music_path: music_path,
		err: err,
		ready: ready
	};
}

export default music;
