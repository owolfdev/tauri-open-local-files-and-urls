// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_file, open_url])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn open_file(file_path: String) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  let opener = "xdg-open";

  #[cfg(target_os = "macos")]
  let opener = "open";

  #[cfg(target_os = "windows")]
  let opener = "cmd /c start";

  std::process::Command::new(opener)
    .arg(file_path)
    .spawn()
    .map_err(|err| format!("Failed to open file: {}", err))?;

  Ok(())
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  let opener = "xdg-open";

  #[cfg(target_os = "macos")]
  let opener = "open";

  #[cfg(target_os = "windows")]
  let opener = "start";

  std::process::Command::new(opener)
    .arg(url)
    .spawn()
    .map_err(|err| format!("Failed to open URL: {}", err))?;

  Ok(())
}
