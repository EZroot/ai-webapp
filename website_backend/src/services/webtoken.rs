use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation, errors::ErrorKind};
use serde::{Deserialize, Serialize};
use actix_web::{web, HttpResponse, http::StatusCode, error::ResponseError};
use chrono;
use core::fmt;
use std::env;
use jsonwebtoken::errors::Error as JwtError;

#[derive(Debug)]
pub struct MyJwtError(JwtError);

impl fmt::Display for MyJwtError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // This will display the inner JwtError's message.
        // You might want to customize this message based on the JwtError's variants
        // for a more user-friendly error message.
        write!(f, "JWT error: {}", self.0)
    }
}

impl std::error::Error for MyJwtError {}


#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Subject (who the token is about, typically user id)
    pub exp: usize,  // Expiration time (as a Unix timestamp)
}

impl ResponseError for MyJwtError {
    fn error_response(&self) -> HttpResponse {
        match *self.0.kind() { // Adjust this line
            ErrorKind::ExpiredSignature => {
                HttpResponse::Unauthorized().json("Token expired")
            },
            _ => HttpResponse::Unauthorized().json("Invalid token"),
        }
    }
}


pub fn generate_token(user_id: &str) -> Result<String, actix_web::Error> {
    // Load the secret key from an environment variable
    let secret_key = "mmbgv8D4ix6kxikN/WAzNHMU2BJ3WaEaiNDmHuEokn9hRF6JKJuO+vWiWHpb6gEM
    cgdPsd9qKroL3yKhd3m0IQ==";//env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let expiration_time = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration_time,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret_key.as_bytes()))
        .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to generate token"))
}

pub fn validate_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let secret_key = "mmbgv8D4ix6kxikN/WAzNHMU2BJ3WaEaiNDmHuEokn9hRF6JKJuO+vWiWHpb6gEM
    cgdPsd9qKroL3yKhd3m0IQ==";// env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret_key.as_ref()),
        &Validation::default(),
    )
    .map(|data| data.claims)
}
