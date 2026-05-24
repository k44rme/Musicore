import Search from "../components/Search";
import "../assets/css/MainPage.css"
import Playlists from "../components/Playlists";
import Musicore_full from "../assets/Musicore Full.svg";
import { lazy, Suspense } from "react";

function MainPage() {
    const Music = lazy(() => import("../components/Music"));

    return (
        <>
            <Search/>
            <img src={Musicore_full} className="logo" />
            <Playlists />
            <Suspense fallback={<span style={{position: "absolute", top: "60%", left: "50%", transform: "translateX(-50%)"}}>Loading...</span>}>
                <Music />
            </Suspense>
        </>
    )

}

export default MainPage;