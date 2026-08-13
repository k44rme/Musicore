import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel";
import WindowDecoration from "./components/WindowDecoration";
import { platform, Platform } from "@tauri-apps/plugin-os";
import { useState, useEffect } from "react";
import useWindowResize from "./components/hooks/useWindowResize";

let visibility = true;

function Layout() {
	useEffect(() => {
		let os: Platform = platform();
		
		if (os == 'android') {
			visibility = false
		}
	}, []);

	let device_type: "mobile" | "desktop" = "mobile";

	useEffect(() => {
		let os: Platform = platform();

		if (os == 'android') {
			device_type = "mobile";
		} else {
			device_type = "desktop"
		}
	}, []);
	
	const [device, setDevice] = useState<"mobile" | "desktop">(device_type);
	
	let resize_event = useWindowResize().windowSize;
	let window_width = useWindowResize().getWindowSize();
	
	useEffect(() => {
		if (window_width <= 500) {
			setDevice("mobile");
		} else if (window_width > 500) {
			setDevice("desktop");
		}
		console.log(device)
	}, [resize_event]);

	useEffect(() => {
		if (window_width <= 500) {
			setDevice("mobile");
		} else if (window_width > 500) {
			setDevice("desktop");
		}
	}, []);

	return (
		<>
			{visibility && <WindowDecoration />}
			<div className="app">
				<SidePanel />
				<Outlet context={device} />
			</div>
		</>
	);
}

export default Layout;
