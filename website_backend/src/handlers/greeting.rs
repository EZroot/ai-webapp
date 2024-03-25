use actix_web::{web, HttpResponse, Responder};
use std::collections::HashMap;
use crate::models::greeting::Greeting;

pub async fn greet(query: web::Query<HashMap<String, String>>) -> impl Responder {
    let msg = match query.get("query") {
        Some(query) => format!("Hello from Rust! You queried: {}", query),
        None => "Hello from Rust!".to_string(),
    };

    let greeting = Greeting { message: msg };
    HttpResponse::Ok().json(greeting)
}
