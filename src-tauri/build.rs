fn main() {
    let config_path = std::env::current_exe()
        .unwrap()
        .parent()
        .unwrap()
        .join("musicore.config.toml");

    match std::fs::copy("musicore.config.toml", config_path) {
        Ok(_) => println!("All right"),
        Err(e) => println!("{}", e)
    }

    tauri_build::build()
}
