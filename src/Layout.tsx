import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel";
import WindowDecoration from "./components/WindowDecoration";

function Layout() {
    return ( 
        <>
            <WindowDecoration />
            <>
                <SidePanel />
                <Outlet />
            </>
        </>
     );
}

export default Layout;