import "@style/pages/MainPage.sass"

function MainPage() {

    const library = [
        {
            type: "author",
            icon: "",
            name: "Author"
        },
        {
            type: "song",
            icon: "",
            name: "Song"
        },
        {
            type: "song",
            icon: "",
            name: "Song"
        },
        {
            type: "song",
            icon: "",
            name: "Song"
        }
    ]

    return (
        <div className="MainPage">
            <div className="library">
                <h2 className="library-label">Библиотека</h2>
                    {/* Authors column */}
                    <div className="library-column">
                        {library
                            .filter(item => item.type === "author")
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
                            .filter(item => item.type !== "author")
                            .map((item, index) => (
                                <div key={index} className="library-item song">
                                    {item.icon === "" ? (
                                        <span className="song-icon"></span>
                                    ) : (
                                        <img 
                                            className="song-icon" 
                                            src={item.icon} 
                                            alt={item.name}
                                        />
                                    )}
                                    <span className="song-name">{item.name}</span>
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