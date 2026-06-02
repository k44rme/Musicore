import { useRef } from "react";
import player from "../logic/player";

function PlayerPage() {
  const audio_el = useRef<HTMLAudioElement>(null);

  let plr = player()
  let song = plr.song
  let file = plr.file
  let initialize_song = plr.init
  let audio_actions = plr.actions

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