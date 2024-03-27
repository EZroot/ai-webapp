use actix_web::{web, HttpResponse, Responder};
use diesel::{prelude::*, result::Error};
use crate::{models::diesel_user::NewUser, services::database};
use crate::schema::users::dsl::*;
use diesel::r2d2::{ConnectionManager, Pool};
use bcrypt;


pub async fn register_user(
    new_user: web::Json<NewUser>,
) -> impl Responder {
    let pool = database::get_connection_pool();
    let new_user_data = new_user.into_inner();
    println!("Registering new user: {:?}, with role: {}", new_user_data.username, new_user_data.role);

    match pool.get() {
        Ok(mut conn) => {
            match database::create_user(&mut conn, &new_user_data) {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{test, App, web};
    use actix_web::http::{self, StatusCode};
    use super::*; // Import your module here

    #[test]
    async fn test_register_user_ok() {
        let mut app = test::init_service(App::new().route("/register", web::post().to(register_user))).await;
        let req = test::TestRequest::post()
            .uri("/register")
            .set_json(&NewUser {
                username: "testuser".to_string(),
                password_hash: "password".to_string(), // You'd use a real hash in a real scenario
                email: "test@example.com".to_string(),
                role: "user".to_string(),
            })
            .to_request();

        let resp = test::call_service(&mut app, req).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }

    // Add more tests here, e.g., for different scenarios like database connection failures
}
