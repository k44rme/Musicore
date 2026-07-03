import {
	BaseDirectory,
	mkdir,
	readTextFile,
	exists,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { documentDir } from "@tauri-apps/api/path";
import toml from "toml";
import { Config } from "../structs";

async function createConfig() {
	const source = "musicore.config.toml";
	const subfolder = "Musicore";
	const destination = `${subfolder}/musicore.config.toml`;
	const content = `

        music_path = ""

        [profile]
        avatar = "assets/profile" # Path to avatar
        banner = "assets/profile" # Path to banner
        nickname = "k44rme" # Replace this string to your nickname

        [playlists]
        favorites.icon = ""
        favorites.name = "Любимое"

        history.icon = ""
        history.name = "История"
    `;

	try {
		await mkdir(subfolder, {
			baseDir: BaseDirectory.Document,
			recursive: true,
		});

		await writeTextFile(`${subfolder}/${source}`, content, {
			baseDir: BaseDirectory.Document,
		});

		const docPath = await documentDir();
		console.log(`File created successfully to ${docPath}/${destination}`);
	} catch (error) {
		console.error("Failed to copy file:", error);
	}
}

export async function readConfig() {
	const file = "musicore.config.toml";
	const exist = await exists("Musicore", { baseDir: BaseDirectory.Document });

	try {
		if (!exist) await createConfig();

		const config = await readTextFile("Musicore/" + file, {
			baseDir: BaseDirectory.Document,
		});
		return toml.parse(config);
	} catch (error) {
		console.error(error);
	}
}

