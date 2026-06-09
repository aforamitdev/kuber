use anyhow::Result;
use duckdb::{Config, Connection};
use parking_lot::Mutex;
use std::{path::PathBuf, sync::Arc};

use crate::db::migrations;

pub struct KuberaDb {
    conn: Arc<Mutex<Connection>>,
}

impl KuberaDb {
    pub fn open(app_dir_path: &PathBuf) -> Result<Self> {
        std::fs::create_dir_all(app_dir_path)?;
        let db_path = app_dir_path.join("assets.duckdb");

        let config = Config::default().access_mode(duckdb::AccessMode::ReadWrite)?;
        let conn = Connection::open_with_flags(&db_path, config)?;

        conn.execute_batch(
            "
            SET memory_limit='512MB';
            SET threads=4;
            ",
        )?;

        migrations::run(&conn)?;

        let db = Self {
            conn: Arc::new(Mutex::new(conn)),
        };
        Ok(db)
    }

    pub fn conn(&self) -> Arc<Mutex<Connection>> {
        self.conn.clone()
    }
}
