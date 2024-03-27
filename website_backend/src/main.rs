mod models;
mod handlers;
mod services;
mod utils;
mod schema;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};

use handlers::{chat, greeting, image_gen, delete, register};

// Placeholder for the about handler, adapt as needed
async fn about() -> impl Responder {
    HttpResponse::Ok().body("About page placeholder")
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(
                web::scope("/api")
                    .route("/greet", web::get().to(greeting::greet))
                    .route("/chat", web::post().to(chat::chat))
                    .route("/imagegen", web::post().to(image_gen::generate)) 
                    .route("/register", web::post().to(register::register_user))
                    .route("/delete", web::post().to(delete::delete_user))

                )
            .service(fs::Files::new("/", "../website_spa/build").index_file("index.html"))
            // Placeholder services for demonstration; adapt as needed
            .route("/about", web::get().to(about))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
