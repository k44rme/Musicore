import { getCurrentWindow } from "@tauri-apps/api/window";
import close from "@assets/icons/Titlebar/close-icon.svg";
import minimize from "@assets/icons/Titlebar/minimize.svg"
import "@css/WinDecoration.css"

let appWindow = getCurrentWindow();
function WindowDecoration() {
    return (
        <div className="win-dec" data-tauri-drag-region>
            <div className="btns">
                <button className="close" onClick={() => appWindow.close()}>
                    <img className="close-btn" src={ close } />
                </button>
                <button className="minimize" onClick={() => appWindow.minimize()}>
                    <img className="minimize-btn" src={ minimize } />
                </button>
            </div>
        </div>
    )
}



export default WindowDecoration;