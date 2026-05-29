import avatar from "@assets/test_assets/k44rme.jpg"
import banner from "@assets/test_assets/k44rme_banner.png"
import logo from "@assets/Musicore Full.svg"

import track_cover from "@assets/test_assets/Test track cover.png"
import album_cover from "@assets/test_assets/Test album cover.png"
import author_cover from "@assets/test_assets/Test author img.png"

import "@css/ProfilePage.css"
import "@css/Music.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

function ProfilePage() {
    const [profile, setProfile] = useState<string>()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await invoke<string>("get_profile_info")
                setProfile(res)
                console.log(res)
                console.log(profile)
            } catch (error) {
                console.log(error);
            }
        }

        loadProfile()
    })

    let profile_string: string = profile ?? "Nickname"
    console.log(profile_string)
    let nickname = JSON.parse(profile_string).nickname
    console.log(nickname)

    return (
        <div className="profile">
            <Link to="/">
                <img src={logo} alt="" className="logo" />
            </Link>
           <div className="header">
                <img src={avatar} alt="" className="profile-avatar" />
                <img src={banner} alt="" className="banner" />
                <h1 className="nickname">{nickname}</h1>
           </div>
           <div className="body">
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
           </div>
        </div>
    )
}

export default ProfilePage;