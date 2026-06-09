use std::time::{SystemTime, UNIX_EPOCH};

use tauri::State;

use crate::account::models::{Account, AccountInput};
use crate::account::storage::AccountStore;

fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

#[tauri::command]
pub fn account_create(store: State<'_, AccountStore>, input: AccountInput) -> Account {
    let now = now_ms();
    let acc = Account {
        id: format!("acc_{}", now),
        name: input.name,
        institution: input.institution,
        currency: input.currency,
        balance: input.balance,
        created_at: now,
        updated_at: now,
    };
    print!("{:?}", acc);
    store.accounts.lock().unwrap().push(acc.clone());
    acc
}

#[tauri::command]
pub fn account_list(store: State<'_, AccountStore>) -> Vec<Account> {
    store.accounts.lock().unwrap().clone()
}

#[tauri::command]
pub fn account_get(store: State<'_, AccountStore>, id: String) -> Option<Account> {
    store
        .accounts
        .lock()
        .unwrap()
        .iter()
        .find(|a| a.id == id)
        .cloned()
}

#[tauri::command]
pub fn account_update(
    store: State<'_, AccountStore>,
    id: String,
    input: AccountInput,
) -> Option<Account> {
    let mut list = store.accounts.lock().unwrap();
    let acc = list.iter_mut().find(|a| a.id == id)?;
    acc.name = input.name;
    acc.institution = input.institution;
    acc.currency = input.currency;
    acc.balance = input.balance;
    acc.updated_at = now_ms();
    Some(acc.clone())
}

#[tauri::command]
pub fn account_delete(store: State<'_, AccountStore>, id: String) -> bool {
    let mut list = store.accounts.lock().unwrap();
    let before = list.len();
    list.retain(|a| a.id != id);
    list.len() != before
}
