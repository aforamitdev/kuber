use std::sync::Mutex;

use crate::account::models::Account;

#[derive(Default)]
pub struct AccountStore {
    pub accounts: Mutex<Vec<Account>>,
}
