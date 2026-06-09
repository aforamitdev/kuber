use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub name: String,
    pub institution: String,
    pub currency: String,
    pub balance: f64,
    pub created_at: i64,
    pub updated_at: i64,
}



#[derive(Debug, Deserialize)]
pub struct AccountInput {
    pub name: String,
    pub institution: String,
    pub currency: String,
    pub balance: f64,
}
