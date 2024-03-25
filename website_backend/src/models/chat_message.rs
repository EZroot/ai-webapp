use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ChatMessage {
    pub message: String,
}

#[derive(Deserialize)]
pub struct ChatRequest {
    pub message: String,
}
