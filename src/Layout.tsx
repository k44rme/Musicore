import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel";
import WindowDecoration from "./components/WindowDecoration";

function Layout() {
	return (
		<>
			<WindowDecoration />
			<div className="app">
				<SidePanel />
				<Outlet />
			</div>
		</>
	);
}

export default Layout;
