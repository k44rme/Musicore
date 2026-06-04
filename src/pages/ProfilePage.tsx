import avatar from "@assets/test_assets/k44rme.jpg"
import banner from "@assets/test_assets/k44rme_banner.png"

import "@style/ProfilePage.sass"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

function ProfilePage() {
    const [profile, setProfile] = useState<string>()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await invoke<string>("get_profile_info")
                setProfile(res)
            } catch (error) {
                console.log(error);
            }
        }

        loadProfile()
    })

    let profile_string: string = profile ?? "Loading..."
    console.log(profile_string)
    let nickname
    if (profile_string != "Loading...") {
        nickname = JSON.parse(profile_string).nickname
    } else {
        nickname = profile_string
    }
    console.log(nickname)

    return (
        <div className="profile">
           <div className="header">
                <img src={avatar} alt="" className="profile-avatar" />
                <img src={banner} alt="" className="banner" />
                <h1 className="nickname" onClick={() => {
                    let newEl = document.createElement("from")
                    newEl.classList.add("nickname-edit")
                    let input = document.createElement("input")
                    input.classList.add("nickname-edit-field")
                    input.placeholder = "New nickname"
                    let submit_btn = document.createElement("button")
                    submit_btn.classList.add("nickname-edit-btn")
                    submit_btn.innerText = "OK"
                    newEl.appendChild(input)
                    newEl.appendChild(submit_btn)
                    document.querySelector(".nickname")?.replaceWith(newEl)
                }}>{nickname}</h1>
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
        </div>
    )
}

export default ProfilePage;