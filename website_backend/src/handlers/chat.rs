use actix_web::{web, HttpResponse, Responder};
use crate::models::chat_message::{ChatRequest,ChatMessage};

pub async fn chat(body: web::Json<ChatRequest>) -> impl Responder {
    println!("Chat endpoint hit with message: {}", body.message);
    HttpResponse::Ok().json(ChatMessage {
        message: format!("Received your message: {}", body.message),
    })
}