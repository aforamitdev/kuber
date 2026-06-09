mod account;
mod db;

use account::command::account_create;
use account::storage::AccountStore;
use db::KuberaDb;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AccountStore::default())
        .setup(|app| {
            let app_dir = app.path().home_dir()?;
            let db = KuberaDb::open(&app_dir)?;
            app.manage(db);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![account_create])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
