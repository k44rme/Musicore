import { useEffect, useRef, useState } from "react";
import player from "../logic/player";
import "@style/pages/PlayerPage.sass";
import Icon from "../components/Icon";

function PlayerPage() {
	const [icon, setIcon] = useState("play");
	const [currentDuration, setCurrentDuration] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const audio_el = useRef<HTMLAudioElement>(null);

	const plr = player();
	const song = plr.song;
	const file = plr.file;
	const initialize_song = plr.init;

	const track: string = song?.file[song.index].file_name ?? "";

	const formatTime = (seconds: number) => {
		if (!isFinite(seconds) || seconds < 0) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const parseDurationToSeconds = (durationStr: string) => {
		if (!durationStr) return 0;
		const parts = durationStr.split(":").map(Number);

		if (parts.length === 3) {
			return parts[0] * 3600 + parts[1] * 60 + parts[2];
		}
		if (parts.length === 2) {
			return parts[0] * 60 + parts[1];
		}
		return parts[0] || 0;
	};

	// Get audio element safely
	const audio = audio_el.current;

	useEffect(() => {
		if (!audio) return;

		const updateTime = () => {
			setCurrentDuration(audio.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setIcon("play");
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [audio]); // Add audio as dependency

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = Number(e.target.value);
		if (audio) {
			audio.currentTime = newTime;
			setCurrentDuration(newTime);
		}
	};

	const togglePlay = () => {
		if (!audio) return;
		
		if (isPlaying) {
			audio.pause();
			setIcon("play");
			setIsPlaying(false);
		} else {
			audio.play();
			setIcon("pause");
			setIsPlaying(true);
		}
		if (currentDuration == totalDuration) setCurrentDuration(0)

	};
	
	// Check if song ended (use >= to handle floating point)
	useEffect(() => {
		if (totalDuration > 0 && currentDuration >= totalDuration - 1) {
			setIsPlaying(false);
			setIcon("play");
		}
		
		if (currentDuration > totalDuration) setCurrentDuration(totalDuration)
	}, [currentDuration, totalDuration]);

	const changeTrack = (direction: "next" | "previous") => {
		if (!song || !audio_el.current) return;

		const newIndex = direction === "next" ? song.index + 1 : song.index - 1;

		// Bounds checking
		if (newIndex < 0 || newIndex >= song.file.length) return;

		const newTrack = song.file[newIndex].file_name;
		const audio = audio_el.current;

		// Update song index in your player logic
		// plr.setIndex(newIndex); // You might need this

		audio.src = initialize_song(newTrack);
		audio.load();
		audio.play();
		setIsPlaying(true);
		setIcon("pause");
		setCurrentDuration(0);
	};

	return (
		<div className="player--page">
			{file?.image == "" ? (
				<div className="player-cover">
					<span className="player-cover-background"></span>
					<Icon icon="music" className="player-cover-icon" />
				</div>
			) : (
				<img
					src={"data:image/png;base64, " + file?.image}
					alt=""
					className="player-cover"
				/>
			)}
			<h1 className="player-song-name">
				{file?.artist} - {file?.title}
			</h1>

			{plr.ready && (
				<audio
					src={initialize_song(track)}
					className="player-music"
					ref={audio_el}
					onLoadedMetadata={(e) => {
						setTotalDuration(e.currentTarget.duration);
					}}
				/>
			)}

			<div className="duration-controller">
				<span>{formatTime(currentDuration)}</span>
				<input
					type="range"
					name="duration-controller"
					min="0"
					max={Math.ceil(totalDuration)-1}
					className="duration-controller-range"
					value={Math.ceil(currentDuration)}
					onChange={handleSeek}
					step="1"
				/>
				<span>{formatTime(totalDuration)}</span>
			</div>

			<div className="control-btns">
				<button
					className="control-btn previous-btn"
					onClick={() => changeTrack("previous")}
				>
					<Icon icon="previous" />
				</button>
				<button className="control-btn play-btn" onClick={togglePlay}>
					<Icon icon={icon} />
				</button>
				<button
					className="control-btn next-btn"
					onClick={() => changeTrack("next")}
				>
					<Icon icon="next" />
				</button>
			</div>
		</div>
	);
}

export default PlayerPage;
