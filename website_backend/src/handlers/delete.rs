use actix_web::{web, HttpResponse, Responder};
use crate::services::database;
use crate::models::diesel_user::User; // Ensure you have a User model that includes the ID field

/// Deletes a user by ID.
pub async fn delete_user(
    user_id: web::Path<i32>, // Assuming you're using the user's ID in the path
) -> impl Responder {
    let pool = database::get_connection_pool();

    match pool.get() {
        Ok(mut conn) => {
            match database::delete_user(&mut conn, *user_id) {
                Ok(count) => {
                    if count > 0 {
                        HttpResponse::Ok().json("User deleted successfully")
                    } else {
                        HttpResponse::NotFound().json("User not found")
                    }
                },
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
