import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel";
import WindowDecoration from "./components/WindowDecoration";
import { platform, Platform } from "@tauri-apps/plugin-os";

let visibility = true;
let os: Platform = platform();

if (os == 'android') {
	visibility = false
}

function Layout() {
	return (
		<>
			{visibility && <WindowDecoration />}
			<div className="app">
				<SidePanel />
				<Outlet />
			</div>
		</>
	);
}

export default Layout;
