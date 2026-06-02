import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel";
import WindowDecoration from "./components/WindowDecoration";

function Layout() {
    return ( 
        <>
            <div className="app">
                <SidePanel />
                <main>
                    <Outlet />
                </main>
            </div>
            <WindowDecoration />
        </>
     );
}

export default Layout;