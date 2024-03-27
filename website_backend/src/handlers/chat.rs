use actix_web::{web, HttpResponse, Responder, HttpRequest};
use crate::services::gpt::{Gpt, GptError};
use crate::models::chat_message::{ChatRequest, ChatMessage};
use std::env;
use crate::services::webtoken;

pub async fn chat(req: HttpRequest, body: web::Json<ChatRequest>) -> impl Responder {
    // Attempt to extract the token from the Authorization header
    let token = req.headers().get("Authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "))
        .map(|token| token.to_string());

    // Validate the token
    let claims = match token {
        Some(token) => match webtoken::validate_token(&token) {
            Ok(claims) => claims,
            Err(_) => return HttpResponse::Unauthorized().finish(),
        },
        None => return HttpResponse::Unauthorized().finish(),
    };

    println!("User ID from token: {}", claims.sub);
    let api_key = "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".to_string();

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
