use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct ImageGenRequest {
    pub input: String,
}

#[derive(Serialize)]
pub struct ImageGenResponse {
    pub image_url: String,
}