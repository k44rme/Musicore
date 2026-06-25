import { useEffect, useRef, useState } from "react";
import player from "../../logic/player";
import "@style/pages/PlayerPage.sass";
import PlayerIcon from "../icons/PlayerIcon";

function PlayerPage() {
	const [icon, setIcon] = useState("play");
	const [currentDuration, setCurrentDuration] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [label, setLabel] = useState("");
	const [artist, setArtist] = useState("");
	const [cover, setCover] = useState("");
	const [autoplay, setAutoplay] = useState(false);
	const [volumeIcon, setVolumeIcon] = useState(0);
	const [volume, setVolume] = useState(50);
	const [mute, setMuteState] = useState(true);
	const [run, setRun] = useState(false);

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
		const audio = audio_el.current;

		if (!song) return;
		if (!audio) return;

		setCurrentDuration(0);

		if (!autoplay) {
			setIsPlaying(false)
			setIcon("play")
		} else {
			setIsPlaying(true)
			setIcon("pause")
		}

		setLabel(song.file[song.index].title);
		setArtist(song.file[song.index].artist);
		setCover(song.file[song.index].image);
		setVolume(audio.volume * 100);

		setRun(true)

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

	useEffect(() => {
		if (!audio_el.current) return;

		if (volume <= 100 && volume > 50) setVolumeIcon(1);
		else if (volume >= 50) setVolumeIcon(2);
		else if (volume == 0) setVolumeIcon(3);

		if (mute) {
			audio_el.current.volume = 0;
			setVolumeIcon(3);
		} else if (!mute) {
			audio_el.current.volume = volume / 100;
		}
	}, [song?.index, volume, mute]);

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
			setRun(false)
			setCurrentDuration(totalDuration);
			const timeout = setTimeout(() => {
				changeTrack("next");
				setAutoplay(true);
			}, 1000);

			return () => {
				if (!run) {
					clearTimeout(timeout)
					setRun(true)
				}
			}
		}
	}, [currentDuration]);

	const changeTrack = (direction: "next" | "previous") => {
		if (!song || !audio_el.current) return;

		setIsPlaying(false);

		const newIndex = direction === "next" ? song.index + 1 : song.index - 1;

		if (newIndex < 0 || newIndex >= song.file.length) return;

		const newTrack = song.file[newIndex].file_name;

		setLabel(song.file[newIndex].title);
		setArtist(song.file[newIndex].artist);
		setCover(song.file[newIndex].image);

		song.index = newIndex;

		const audio = audio_el.current;

		audio.src = initialize_song(newTrack);
		audio.load();
		
		if (!autoplay) {
			setIsPlaying(false)
			setIcon("play")
		} else {
			setIsPlaying(true)
			setIcon("pause")
		}
		
		setCurrentDuration(0);
		setRun(false)
	};

	return (
		<div className="player--page">
			{cover == "" ? (
				<div className="player-cover non-cover">
					<span className="player-cover-background"></span>
					<PlayerIcon icon="music" className="player-cover-icon" />
				</div>
			) : (
				<img
					src={"data:image/png;base64, " + cover}
					alt=""
					className="player-cover"
				/>
			)}
			<h1 className="player-song-name">
				{artist} - {label}
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
				<span className="duration-label current-duration">
					{formatTime(currentDuration)}
				</span>
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
				<span className="duration-label total-duration">
					{formatTime(totalDuration)}
				</span>
			</div>

			<div className="control-btns">
				<button
					className="control-btn previous-btn"
					onClick={() => changeTrack("previous")}
				>
					<PlayerIcon icon="previous" />
				</button>
				<button className="control-btn play-btn" onClick={togglePlay}>
					<PlayerIcon icon={icon} />
				</button>
				<button
					className="control-btn next-btn"
					onClick={() => changeTrack("next")}
				>
					<PlayerIcon icon="next" />
				</button>
			</div>

			<div className="bottom-panel">
				<div className="volume-controller">
					<button
						className="volume-btn"
						onClick={() => {
							if (!mute) setMuteState(true);
							else setMuteState(false);
						}}
					>
						<PlayerIcon
							icon={`volume-${volumeIcon}`}
							className="volume-icon"
						/>
					</button>
					<input
						type="range"
						name="volume"
						id="volume-range"
						onChange={(e) => {
							setVolume(Number.parseInt(e.target.value));
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default PlayerPage;
