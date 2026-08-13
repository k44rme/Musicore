import "@style/Settings.sass";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

function Setting({
	title,
	desc,
	type,
	className,
	id,
	value,
	dropdownName,
	dropdownClassName
}: {
	title: string;
	desc: string;
	type: "dropdown" | "text" | "slider";
	className?: string;
	id?: string;
	value?: {value: string, label: string}[];
	dropdownName?: string;
	dropdownClassName?: string
}) {
	switch (type) {
		case "text":
			return (
				<div className={"setting " + className} id={id}>
					<span className="setting-title">{title}</span>
					<span className="setting-desc">{desc}</span>
					<input type="text" name="" id="setting-value" />
				</div>
			);
		case "dropdown":
			if (!value) return;
			return (
				<div className={"setting " + className} id={id}>
					<div className="setting-wrapper">
						<span className="setting-title">{title}</span>
						<select name={dropdownName} id="setting-value">
							{value.map((item, index) => {
								return <option key={index} value={item.value} className={dropdownClassName}>
									{item.label}
								</option>;
							})}
						</select>
						<span className="setting-desc">{desc}</span>
					</div>
				</div>
			);
		case "slider":
			return <></>;
	}
}

function Settings() {
	function switch_to(next_tab: string) {
		const settings = document.querySelector(
			".settings-categories",
		) as HTMLDivElement;

		settings.dataset.current = next_tab;
	}

	const { t } = useTranslation("settings")

	return (
		<dialog id="settings" popover="">
			<button
				type="button"
				popoverTarget="settings"
				popoverTargetAction="hide"
			>
				<Icon icon="close" />
			</button>
			<div className="settings-wrapper">
				<div className="settings-categories" data-current="general">
					<input
						type="search"
						name="settings-search"
						id="settings-searcher"
					/>
					<div
						className="general-settings vertical-tab-item"
						onClick={() => switch_to("general")}
					>
						<svg
							width="17"
							height="17"
							viewBox="0 0 25 25"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="general-settings-icon"
							style={{ marginRight: "3px", paddingTop: "1px" }}
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M25 12.5C25 19.4037 19.4037 25 12.5 25C5.59625 25 0 19.4037 0 12.5C0 5.59625 5.59625 0 12.5 0C19.4037 0 25 5.59625 25 12.5ZM16.25 8.75C16.25 9.74456 15.8549 10.6984 15.1517 11.4017C14.4484 12.1049 13.4946 12.5 12.5 12.5C11.5054 12.5 10.5516 12.1049 9.84835 11.4017C9.14509 10.6984 8.75 9.74456 8.75 8.75C8.75 7.75544 9.14509 6.80161 9.84835 6.09835C10.5516 5.39509 11.5054 5 12.5 5C13.4946 5 14.4484 5.39509 15.1517 6.09835C15.8549 6.80161 16.25 7.75544 16.25 8.75ZM12.5 23.125C14.6453 23.1284 16.741 22.4793 18.5087 21.2637C19.2637 20.745 19.5862 19.7575 19.1462 18.9538C18.2375 17.2875 16.3625 16.25 12.5 16.25C8.6375 16.25 6.7625 17.2875 5.8525 18.9538C5.41375 19.7575 5.73625 20.745 6.49125 21.2637C8.259 22.4793 10.3547 23.1284 12.5 23.125Z"
								fill="currentColor"
							/>
						</svg>
						<span className="general-settings-title">{t("vertical_tab.general")}</span>
					</div>
					<div
						className="profile-settings vertical-tab-item"
						onClick={() => switch_to("profile")}
					>
						{t("vertical_tab.profile")}
					</div>
				</div>
				<div className="main-settings-container">
					<div id="general">
						<Setting
							title={t("main_tab.lang.name")}
							desc={t("main_tab.lang.desc")}
							className="language-setting"
							type="dropdown"
							value={[
								{
									value: "English",
									label: "English"
								},
								{
									value: "Russian",
									label: "Русский"
								}
							]}
						/>
					</div>
				</div>
			</div>
		</dialog>
	);
}

export default Settings;
