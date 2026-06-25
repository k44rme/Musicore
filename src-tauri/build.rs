fn main() {
    // Get the target directory (where the exe will be)
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let profile = std::env::var("PROFILE").unwrap_or_else(|_| "debug".to_string());
    
    // Source config file (in project root)
    let config_src = std::path::Path::new(&manifest_dir)
        .parent()
        .unwrap()
        .join("musicore.config.toml");
    
    // Destination (next to exe)
    let target_dir = std::path::Path::new(&manifest_dir)
        .join("target")
        .join(&profile);
    let config_dest = target_dir.join("musicore.config.toml");
    
    // Create target directory if it doesn't exist
    std::fs::create_dir_all(&target_dir).ok();
    
    // Copy config file
    if config_src.exists() {
        println!("cargo:warning=Copying config from {:?} to {:?}", config_src, config_dest);
        std::fs::copy(&config_src, &config_dest)
            .unwrap_or_else(|e|{ 
                println!("cargo:warning=Failed to copy config: {}", e);
                u64::from(1_u32.to_be())
            });
    } else {
        println!("cargo:warning=Config not found at {:?}, creating default", config_src);
        create_default_config(&config_dest);
    }
    
    // Re-run build script if config changes
    println!("cargo:rerun-if-changed=../musicore.config.toml");

    tauri_build::build();
}

fn create_default_config(path: &std::path::Path) {
    let default = r#"# Musicore Configuration
music_path = ""

[[UserProfile]]
avatar = "src/assets/profile"
banner = "src/assets/profile"
nickname = "Musicore-user"
"#;
    std::fs::write(path, default)
        .unwrap_or_else(|e| println!("cargo:warning=Failed to create default config: {}", e));
}
