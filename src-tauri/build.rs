fn main() {
    let target = std::env::var("PROFILE").unwrap();
    let config_src = "../musicore.config.toml";
    let config_dest = format!("target/{}/musicore.config.toml", target);
    
    println!("cargo:warning=Build profile: {}", target);
    println!("cargo:warning=Config source: {}", config_src);
    println!("cargo:warning=Config destination: {}", config_dest);
    
    if std::path::Path::new(config_src).exists() {
        std::fs::copy(config_src, &config_dest)
            .unwrap_or_else(|e| {
                let i: u64 = 10;
                println!("cargo:warning=Failed to copy config: {}", e);
                i
            });
    } 

    tauri_build::build()
}
