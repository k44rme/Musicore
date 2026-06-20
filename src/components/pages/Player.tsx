import { useEffect, useRef, useState } from "react";
import player from "../../logic/player";
import "@style/pages/PlayerPage.sass";
import Icon from "../Icon";

function PlayerPage() {
	const [icon, setIcon] = useState("play");
	const [currentDuration, setCurrentDuration] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [musicLabel, setMusicLabel] = useState("")
	const [musicArtist, setMusicArtist] = useState("")
	const [cover, setCover] = useState("")
	const [autoplay, setAutoplay] = useState(false)

	const audio_el = useRef<HTMLAudioElement>(null);

	const plr = player();
	const song = plr.song;
	
	const initialize_song = plr.init;
	
	const track: string = song?.file[song.index].file_name ?? "";
	
	const formatTime = (seconds: number) => {
		if (!isFinite(seconds) || seconds < 0) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};
	
	const audio = audio_el.current;
	
	useEffect(() => {
		if (!song) return;

		setCurrentDuration(0)
	
		setIsPlaying(false)
		setMusicLabel(song.file[song.index].title)
		setMusicArtist(song.file[song.index].artist)
		setCover(song.file[song.index].image)
		
		const audio = audio_el.current;
		console.log("Audio element:", audio);
		console.log("Audio src:", audio?.src); 
		
		if (!audio) {
			console.warn("⚠️ Audio element is null!");
			return;
		}
		
		const updateTime = () => {
			setCurrentDuration(audio.currentTime);
		};
		
		audio.addEventListener("timeupdate", updateTime);
		
		console.log("Audio paused:", audio.paused);
		console.log("Audio duration:", audio.duration);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
		};
	}, [song?.index]);

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = Number.parseInt(e.target.value);
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
		
		if (currentDuration == totalDuration) setCurrentDuration(0);
	};

	useEffect(() => {
		if (totalDuration > 0 && currentDuration >= totalDuration - 1) {
			setIsPlaying(false);
			setIcon("play");
		}

		if (currentDuration > totalDuration) {
			setCurrentDuration(totalDuration);
			setTimeout(() => {
				changeTrack("next")
				setAutoplay(true)
			}, 1000)
		}
	}, [currentDuration, totalDuration]);

	const changeTrack = (direction: "next" | "previous") => {
		if (!song || !audio_el.current) return;

		setIsPlaying(false)

		const newIndex = direction === "next" ? song.index + 1 : song.index - 1;

		if (newIndex < 0 || newIndex >= song.file.length) return;

		const newTrack = song.file[newIndex].file_name;

		setMusicLabel(song.file[newIndex].title)
		setMusicArtist(song.file[newIndex].artist)
		setCover(song.file[newIndex].image)

		song.index = newIndex

		const audio = audio_el.current;

		audio.src = initialize_song(newTrack);
		audio.load();
		setIcon(autoplay ? "pause" : "play");
		setCurrentDuration(0);
	};

	return (
		<div className="player--page">
			{cover == "" ? (
				<div className="player-cover non-cover">
					<span className="player-cover-background"></span>
					<Icon icon="music" className="player-cover-icon" />
				</div>
			) : (
				<img
					src={"data:image/png;base64, " + cover}
					alt=""
					className="player-cover"
				/>
			)}
			<h1 className="player-song-name">
				{musicArtist} - {musicLabel}
			</h1>
			<audio
				src={initialize_song(track)}
				className="player-music"
				ref={audio_el}
				onLoadedMetadata={(e) => {
					setTotalDuration(e.currentTarget.duration);
				}}
				key={track}
				autoPlay={autoplay}
			/>
			<div className="duration-controller">
				<span className="duration-label current-duration">{formatTime(currentDuration)}</span>
				<input
					type="range"
					name="duration-controller"
					min="0"
					max={Math.ceil(totalDuration) - 1}
					className="duration-controller-range"
					value={Math.ceil(currentDuration)}
					onChange={handleSeek}
					step="1"
				/>
				<span className="duration-label total-duration">{formatTime(totalDuration)}</span>
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
