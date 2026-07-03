import "@style/pages/Main.sass";

function MainPage() {
	const library = [
		{
			type: "author",
			icon: "",
			name: "Author",
		},
		{
			type: "song",
			icon: "",
			name: "Song",
		},
		{
			type: "song",
			icon: "",
			name: "Song",
		},
		{
			type: "song",
			icon: "",
			name: "Song",
		},
	];

	return (
		<div className="MainPage Page">
			<div className="library">
				<h2 className="library-label">Библиотека</h2>
				{/* Authors column */}
				<div className="library-column">
					{library
						.filter((item) => item.type === "author")
						.map((item, index) => (
							<div key={index} className="library-item author">
								{item.icon === "" ? (
									<span className="author-icon"></span>
								) : (
									<img
										className="author-icon"
										src={item.icon}
										alt={item.name}
									/>
								)}
								<span className="author-name">{item.name}</span>
							</div>
						))}
				</div>

				{/* Songs column */}
				<div className="library-column">
					{library
						.filter((item) => item.type !== "author")
						.map((item, index) => (
							<div
								key={index}
								className="library-item mainpage--song"
							>
								{item.icon === "" ? (
									<span className="mainpage--song-icon"></span>
								) : (
									<img
										className="mainpage--song-icon"
										src={item.icon}
										alt={item.name}
									/>
								)}
								<span className="mainpage--song-name">
									{item.name}
								</span>
							</div>
						))}
				</div>
			</div>
			{/* <div className="usually-listening">
                <h2 className="usualy-listening-label">Часто прослушевамые</h2>
            </div> */}
		</div>
	);
}

export default MainPage;
