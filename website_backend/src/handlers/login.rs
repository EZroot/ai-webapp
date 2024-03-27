use actix_web::{web, HttpResponse, Responder};
use diesel::{prelude::*, result::Error};
use crate::models::diesel_user::LoginRequest;
use crate::{models::diesel_user::NewUser, services::database};
use crate::schema::users::dsl::*;
use diesel::r2d2::{ConnectionManager, Pool};
use bcrypt;


// This should be named differently if it's in the same module as your login service function to avoid conflict.
pub async fn login_handler(
    login_request: web::Json<LoginRequest>,
) -> impl Responder {
    let pool = database::get_connection_pool(); // Get the DB pool
    let login_data = login_request.into_inner(); // Extract the inner LoginRequest data

    // Get a connection from the pool
    match pool.get() {
        Ok(mut conn) => {
            // Now call the actual login function in your service layer, passing the DB connection and login data
            match database::login_user(&mut conn, login_data).await {
                Ok(response) => response,
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}