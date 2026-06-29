import { useEffect, useRef, useState } from "react";
import player from "../../logic/player";
import "@style/pages/Player.sass";
import PlayerIcon from "../icons/PlayerIcon";

function PlayerPage() {
	const [icon, setIcon] = useState("play");
	const [currentDuration, setCurrentDuration] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [label, setLabel] = useState("");
	const [artist, setArtist] = useState("");
	const [cover, setCover] = useState("");
	const [autoplay, setAutoplay] = useState(true);
	const [volumeIcon, setVolumeIcon] = useState(0);
	const [volume, setVolume] = useState(50);
	const [mute, setMuteState] = useState(false);

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
			setIsPlaying(false);
			setIcon("play");
		} else {
			setIsPlaying(true);
			setIcon("pause");
		}

		setLabel(song.file[song.index].title);
		setArtist(song.file[song.index].artist);
		setCover(song.file[song.index].image);

		audio.volume = song.volume / 100;
		setVolume(audio.volume * 100);

		console.log("Audio element:", audio);
		console.log("Audio src:", audio?.src);

		if (!audio) {
			console.warn("⚠️ Audio element is null!");
			return;
		}

		const updateTime = () => {
			setCurrentDuration(audio.currentTime);
		};

		if (currentDuration > totalDuration) {
			audio.removeEventListener("timeupdate", updateTime);
		} else {
			audio.addEventListener("timeupdate", updateTime);
		}

		const clearTimeUpdate = () =>
			audio.addEventListener("ended", () =>
				audio.removeEventListener("timeupdate", updateTime),
			);

		console.log("Audio paused:", audio.paused);
		console.log("Audio duration:", audio.duration);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("ended", clearTimeUpdate);
		};
	}, [song?.index]);

	useEffect(() => {
		if (!audio) return;
		if (!song) return;

		const el = document.querySelector(
			"input[type='range']",
		) as HTMLInputElement;

		if (!el) return;
		else {
			const min = Number.parseInt(el.min) || 0;
			const max = Number.parseInt(el.max) || 100;
			const pct = ((Number.parseInt(el.value) - min) / (max - min)) * 100;
			el.style.setProperty("--range-pct", pct + "%");
		}

		if (mute) {
			audio.volume = 0;
			setVolumeIcon(3);
		} else {
			audio.volume = volume / 100;
			song.volume = volume;

			const el = document.querySelector(
				"#volume-range",
			) as HTMLInputElement;

			if (!el) return;
			else {
				const min = Number.parseInt(el.min) || 0;
				const max = Number.parseInt(el.max) || 100;
				const pct =
					((Number.parseInt(el.value) - min) / (max - min)) * 100;
				el.style.setProperty("--range-pct", pct + "%");
			}
		}
	});

	useEffect(() => {
		if (volume <= 100 && volume > 50) setVolumeIcon(1);
		else if (volume >= 50) setVolumeIcon(2);
		else if (volume == 0) setVolumeIcon(3);
	}, [volume, mute]);

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = Number.parseInt(e.target.value);
		if (audio) {
			audio.currentTime = newTime;
			setCurrentDuration(newTime);
		}

		const el = e.target;
		const min = Number.parseInt(el.min) || 0;
		const max = Number.parseInt(el.max) || 100;
		const pct = ((Number.parseInt(el.value) - min) / (max - min)) * 100;
		el.style.setProperty("--range-pct", pct + "%");
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
			setIsPlaying(false);
			setIcon("play");
		} else {
			setIsPlaying(true);
			setIcon("pause");
		}

		setCurrentDuration(0);
	};

	useEffect(() => {
		if (!audio) return;

		const handleEnded = () => {
			setIsPlaying(false);
			setIcon("play");
			setCurrentDuration(totalDuration);
			setAutoplay(true);

			changeTrack("next");
		};

		audio.addEventListener("ended", handleEnded);

		return () => audio.removeEventListener("ended", handleEnded);
	}, [changeTrack, totalDuration]);

	return (
		<div className="player--page Page">
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
							const el = e.target;
							const min = Number.parseInt(el.min) || 0;
							const max = Number.parseInt(el.max) || 100;
							const pct =
								((Number.parseInt(el.value) - min) /
									(max - min)) *
								100;
							el.style.setProperty("--range-pct", pct + "%");
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default PlayerPage;
