import "@style/SidePanel.sass"
import Musicore from "@assets/Logo.svg"
import { Link } from "react-router-dom";
import avatar from "@assets/test_assets/k44rme.jpg"

function SidePanel() {
    const menuItems = [
        {id: 1, label: "Главная", path: "/"},
        {id: 2, label: "Поиск", path: "/search"},
        {id: 3, label: "Discover", path: "/discover"},
        {id: 4, label: "Библиотека", path: "/library"}
    ]

    let playlists = [
        "Любимое",
        "Новый плейлист",
        "Избранное"
    ]

    return ( 
        <div className="side-panel">
            <img src={Musicore} alt="" className="logo" />
            <h2 className="menu-label">Menu</h2>
            <ul className="menu">
                {
                    menuItems.map((item: any) => {
                        let className = `menu-item menu-item-${item.id}`
                        return (
                            <li className={className} key={item.id}>
                                <Link to={item.path} className="menu-item-label">{item.label}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            <h2 className="sidepanel-playlist-label">Playlists</h2>
            <ul>
                {
                    playlists.map((playlist: any, index) => (
                        <li className="sidepanel-playlist-item" key={index}>
                            <Link to={`/playlist/${playlist}`}>{playlist}</Link>
                        </li>
                    ))
                }
            </ul>
            <Link className="sidepanel-profile" to="/profile">
                <img src={avatar} alt="" className="sidepanel-avatar" />
                <span className="sidepanel-username">Nickname</span>
            </Link>
        </div>
     );
}

export default SidePanel;