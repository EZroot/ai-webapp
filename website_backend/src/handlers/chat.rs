use actix_web::{web, HttpResponse, Responder};
use crate::services::gpt::{Gpt, GptError};
use crate::models::chat_message::{ChatRequest, ChatMessage};
use std::env;

pub async fn chat(body: web::Json<ChatRequest>) -> impl Responder {
    println!("Setting API key");
    // let api_key = match env::var("OPENAI_API_KEY") {
    //     Ok(key) => key,
    //     Err(_) => return HttpResponse::InternalServerError().body("API key not configured."),
    // };
    let api_key = "setkey".to_string();

    let mut gpt_client = Gpt::new();
    gpt_client.set_api_key(&api_key);

    match gpt_client.make_request(&body.message).await {
        Ok(response_message) => HttpResponse::Ok().json(ChatMessage { message: response_message }),
        Err(GptError::Unauthorized) => HttpResponse::Unauthorized().body("Unauthorized request."),
        Err(GptError::NoApiKey) => HttpResponse::InternalServerError().body("API key not configured."),
        Err(GptError::RequestError(err)) => HttpResponse::BadRequest().body("Bad request to GPT."),
        Err(GptError::ResponseError(msg)) => HttpResponse::InternalServerError().body(format!("Error from GPT: {}", msg)),
    }
}
