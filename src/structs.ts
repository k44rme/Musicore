export type MusicFile = {
	id: string;
	file_name: string;
	title: string;
	artist: string;
	duration: string;
	duration_num: number;
	image: string;
	audio: string;
};

export type Config = {
	music_path: String;
	profile: Profile;
};

export type Profile = {
	avatar: String;
	banner: String;
	nickname: String;
};
