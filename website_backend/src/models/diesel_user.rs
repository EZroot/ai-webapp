// At the top of your diesel_users.rs or any other file
use diesel::Insertable;
use diesel::Queryable;

use crate::schema::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
    pub email: String,
    pub role: String,
}

#[derive(Insertable, Serialize, Deserialize)]
#[table_name = "users"]
pub struct NewUser {
    pub username: String,
    pub password_hash: String,
    pub email: String,
    pub role: String,
}

