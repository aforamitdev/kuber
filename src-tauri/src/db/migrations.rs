use duckdb::{params, Connection};

const MIGARTSIONS: &[(i64, &str, &str)] = &[
    (
        1,
        "create_accounts",
        include_str!("../../migrations/001_create_accounts.sql"),
    ),
    (
        2,
        "update_accounts",
        include_str!("../../migrations/002_create_upgraded_accounts.sql"),
    ),
    (
        3,
        "create_instutions",
        include_str!("../../migrations/003_create_instutations.sql"),
    ),
];

pub fn run(conn: &Connection) -> duckdb::Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS _migrations(
        version    BIGINT PRIMARY KEY,
        name       VARCHAR NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT now()
        );",
    )?;

    let current: i64 = conn.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM _migrations",
        [],
        |row| row.get(0),
    )?;

    for (version, name, sql) in MIGARTSIONS {
        if *version > current {
            conn.execute_batch("BEGIN TRANSACTION;")?;
            conn.execute_batch(sql)?;
            conn.execute(
                "INSERT INTO _migrations (version, name) VALUES (?, ?)",
                params![version, name],
            )?;
            conn.execute_batch("COMMIT;")?;
            println!("Applied migration {version}: {name}");
        }
    }
    Ok(())
}
