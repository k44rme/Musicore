export type MusicFile = {
  id: string;
  file_name: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  audio: string;
};

export type Config = {
  music_path: String;
  profile: UserProfile;
}

export type UserProfile = {
  avatar: String;
  banner: String;
  nickname: String;
}