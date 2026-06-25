import { getCurrentWindow } from "@tauri-apps/api/window";
import Icon from "./Icon"
import "@style/WinDecoration.sass"

let appWindow = getCurrentWindow();
function WindowDecoration() {
    return (
        <div className="win-dec" data-tauri-drag-region>
            <div className="btns">
                <button className="close" onClick={() => appWindow.close()}>
                    <Icon icon="close" className="close-btn" />
                </button>
                <button className="minimize" onClick={() => appWindow.minimize()}>
                    <Icon icon="minimize" className="minimize-btn" />
                </button>
            </div>
        </div>
    )
}



export default WindowDecoration;