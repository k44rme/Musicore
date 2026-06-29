import { invoke } from "@tauri-apps/api/core";
import { Link } from "react-router-dom";
import { MusicFile } from "../structs";
import music_fn from "../logic/music";
import { useEffect, useRef, useState } from "react";
import "../structs";
import "@style/Music.sass";
import Icon from "./Icon";

function Music() {
	const [path, setPath] = useState("");
	const [display, setDisplay] = useState<"flex" | "none">("none");
	const [visibleSongsCount, setVisibleSongsCount] = useState(3);
	const IntersectionRef = useRef<HTMLDivElement>(null);

	let mus = music_fn();
	let config = mus.config;
	let music: MusicFile[] = mus.music;

	let visibleSongs = music.slice(0, visibleSongsCount);

	let music_path: String = config?.music_path ?? mus.music_path ?? "";

	useEffect(() => {
		if (music_path != "") setDisplay("none");
		else setDisplay("flex");
	});

	useEffect(() => {
		const currentObserver = IntersectionRef.current;
		const observer = new IntersectionObserver(
			(entry) => {
				if (
					entry[0].isIntersecting &&
					visibleSongsCount < music.length
				) {
					setTimeout(() => {
						setVisibleSongsCount((prev) =>
							Math.min(prev + 10, music.length),
						);
					});
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.75,
			},
		);

		if (currentObserver) observer.observe(currentObserver);

		return () => {
			if (currentObserver) observer.unobserve(currentObserver);
		};
	});

	if (music_path != "") {
		console.log("Config found, music is loading...");
		console.log(config?.music_path, mus.music_path);

		return (
			<div className="song-list" ref={IntersectionRef}>
				{visibleSongs.map((file: MusicFile, index: number) => {
					let queue = {
						index: index,
						file: music,
						volume: 50
					};

					let song = "song song-" + (index + 1);
					return (
						<div
							key={file.file_name}
							className={song}
							ref={IntersectionRef}
						>
							{file.image == "" ? (
								<div className="none-song-cover">
									<span className="none-song-cover-background"></span>
									<Icon
										icon="music"
										className="none-song-cover-icon"
									/>
								</div>
							) : (
								<img
									src={
										"data:image/png;base64, " + file?.image
									}
									alt=""
									className="song-cover"
								/>
							)}
							<div className="song-info">
								<Link
									className="song-title"
									state={queue}
									to={`/play/${file.id}`}
								>
									{file.title}
								</Link>
								<p className="song-artist">{file.artist}</p>
							</div>
							<div className="song-duration">
								<span className="song-duration-label">
									{file.duration}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div
			style={{
				display: display,
				flexDirection: "column",
				width: "500px",
				alignItems: "center",

				position: "relative",
				top: "50%",
				transform: "translateY(-50%)",
			}}
		>
			<span style={{ textAlign: "center" }}>
				Путь до вашей папки c музыкой?
			</span>
			<form className="find-music">
				<input
					type="text"
					name="music"
					id="set-music-path"
					value={path}
					placeholder="C:/Users/...."
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setPath(e.target.value);
					}}
				/>
				<button
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						const newMusicPath = async () => {
							try {
								await invoke("edit_music_path", {
									newMusicPath: path,
								});
								window.location.reload();
							} catch (error) {
								console.error(error);
							}
						};
						newMusicPath();
					}}
				>
					OK
				</button>
			</form>
		</div>
	);
}

export default Music;
