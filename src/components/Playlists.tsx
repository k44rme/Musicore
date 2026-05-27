import "@css/Playlists.css"

function Playlists() {
    /* let content = [
        {"name": "Любимое", "img": null},
        {"name": "Избраннок", "img": null},
        {"name": "Рекоменадции", "img": null},
        {"name": "Новый плейлист", "img": null},
    ] */

    let content = [
        "Любимое",
        "Избранное",
        "Рекоменадции",
        "Новый плейлист"
    ]
    return (
        <div className="playlists">
            {JSON.parse(JSON.stringify(content)).map((item: any) => {
                const playlists = `playlist playlist-${content.indexOf(item)}`;
                return (
                <div className={playlists} key={content.indexOf(item)}>
                    <h3 key={`${content.indexOf(item)}-title`} className="label">{item}</h3>
                </div>
                );
            })}
        </div>
    )
}

export default Playlists;