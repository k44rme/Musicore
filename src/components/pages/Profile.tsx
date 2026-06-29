import avatar from "@assets/test_assets/k44rme.jpg";
import banner from "@assets/test_assets/k44rme_banner.png";

import "@style/pages/Profile.sass";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function ProfilePage() {
	const [profile, setProfile] = useState<string>();
	const [name, setName] = useState<string>();

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const res = await invoke<string>("get_profile_info");
				setProfile(res);
			} catch (error) {
				console.log(error);
			}
		};

		loadProfile();
	});

	function edit_profile_name() {
		const editProfileName = async () => {
			try {
				await invoke("edit_profile", {
					prop: "nickname",
					val: name ?? "Nickname",
				});
			} catch (error) {
				console.log(error);
			}
		};

		editProfileName();
	}

	let profile_string: string = profile ?? "Loading...";
	console.log(profile_string);
	let nickname;
	if (profile_string != "Loading...") {
		nickname = JSON.parse(profile_string).nickname;
	} else {
		nickname = profile_string;
	}
	console.log(nickname);

	return (
		<main className="profile Page">
			<div className="header">
				<img src={avatar} alt="" className="profile-avatar" />
				<img src={banner} alt="" className="banner" />
				<h1
					className="nickname"
					onClick={(e) => {
						e.preventDefault();
						document
							.querySelector(".nickname")
							?.classList.toggle("hide");
						document
							.querySelector(".nickname-edit")
							?.classList.toggle("hide");
					}}
				>
					{nickname}
				</h1>
				<form className="nickname-edit hide">
					<input
						type="text"
						className="nickname-edit-field"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
					<button
						type="submit"
						className="nickname-edit-btn"
						onClick={(e) => {
							e.preventDefault();
							edit_profile_name();
							window.location.reload();
						}}
					>
						OK
					</button>
				</form>
			</div>
			{/* <div className="body">
                <div className="recent">
                    <h1 className="recent-label">Недавнее:</h1>
                    <div className="track card">
                        <img src={track_cover} alt="" className="track-cover" />
                        <h2 className="track-name">Айзек</h2>
                        <h5 className="track-author">Mzlff</h5>
                    </div>
                    <div className="album card">
                        <img src={album_cover} alt="" className="album-cover" />
                        <h2 className="album-name">Обыкновенная жизнь</h2>
                        <h5 className="album-author">Mzlff</h5>
                    </div>
                    <div className="author card">
                        <img src={author_cover} alt="" className="author-cover" />
                        <h3 className="author-name">Mzlff</h3>
                    </div>
                </div>
           </div> */}
		</main>
	);
}

export default ProfilePage;
