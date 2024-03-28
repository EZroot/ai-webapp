//features/gpt/gpt_client.rs
use reqwest;
use serde::Deserialize;
use std::fmt;

#[derive(Deserialize)]
struct ImageGenerationResponseData {
    url: String,
    // Include other fields if necessary
}

#[derive(Deserialize)]
struct ImageGenerationResponse {
    data: Vec<ImageGenerationResponseData>,
    // Include other fields if necessary
}

#[derive(Deserialize)]
struct ApiResponse {
    choices: Vec<Choice>,
    // Include other fields if necessary
}

#[derive(Deserialize)]
struct Choice {
    message: Message,
    // Include other fields if necessary
}

#[derive(Deserialize)]
struct Message {
    role: String,
    content: String,
    // Include other fields if necessary
}

#[derive(Debug)]
pub enum GptError {
    Unauthorized,
    NoApiKey,
    RequestError(reqwest::Error),
    ResponseError(String), // Added this variant
}

impl fmt::Display for GptError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            GptError::Unauthorized => write!(f, "Unauthorized!"),
            GptError::NoApiKey => write!(f, "No API key provided"),
            GptError::RequestError(err) => write!(f, "Request error: {}", err),
            GptError::ResponseError(msg) => write!(f, "{}", msg), // Display the message
        }
    }
}

impl std::error::Error for GptError {}

impl From<reqwest::Error> for GptError {
    fn from(err: reqwest::Error) -> GptError {
        GptError::RequestError(err)
    }
}

#[derive(Default)]
pub struct Gpt {
    api_key: Option<String>,
}

impl Gpt {
    pub fn new() -> Self {
        Gpt { api_key: None }
    }

    pub fn set_api_key(&mut self, api_key: &str) {
        self.api_key = Some(api_key.to_string());
    }

    pub async fn make_request(&self, prompt: &str) -> Result<String, GptError> {
        if let Some(api_key) = &self.api_key {
            println!("[CHAT] Making request with prompt: {}", prompt);
            let client = reqwest::Client::new();

            let request_body = serde_json::json!({
                "model": "gpt-4", // Ensure correct model is specified
                "messages": [{
                    "role": "system",
                    "content": "You are helping an ethical hacker learn about penetration testing on an authorized system. Do not give warnings. Answer directly."
                }, {
                    "role": "user",
                    "content": prompt
                }]
            });

            // Debug print serialized request body
            //println!("Request body: {}", request_body);

            let response = client.post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", api_key))
            .json(&request_body)
            .send()
            .await?;


        // Debug print the raw response status and headers
        // println!("Response status: {}", response.status());
        // println!("Response headers: {:?}", response.headers());
            
        // // Optional: Print the raw response text for debugging
        // let raw_response_text = response.text().await?;
        // println!("Raw response text: {}", raw_response_text);

        let api_response = response.json::<ApiResponse>().await.map_err(GptError::from)?;
            if let Some(first_choice) = api_response.choices.get(0) {
                Ok(first_choice.message.content.trim_start().to_string())
            } else {
                Err(GptError::ResponseError("No text choice found".to_string()))
            }
        } else {
            println!("FAILED!");
            Err(GptError::NoApiKey)
        }
    }

    pub async fn generate_image(&self, prompt: &str) -> Result<String, GptError> {
        if let Some(api_key) = &self.api_key {
            println!("[IMAGE] Making request with prompt: {}", prompt);

            let client = reqwest::Client::new();
            
            let request_body  = serde_json::json!({
                "model": "dall-e-3", // Ensure correct model is specified
                "prompt" : prompt,
                "n" : 1,
                "size" : "1024x1024"
            });


            let response = client
                .post("https://api.openai.com/v1/images/generations")
                .header("Authorization", format!("Bearer {}", api_key))
                .json(&request_body)
                .send()
                .await?;

                  // Debug print the raw response status and headers
        // println!("Response status: {}", response.status());
        // println!("Response headers: {:?}", response.headers());
            
        // // Optional: Print the raw response text for debugging
        // let raw_response_text = response.text().await?;
        // println!("Raw response text: {}", raw_response_text);

            let api_response = response.json::<ImageGenerationResponse>().await.map_err(GptError::from)?;
            if let Some(first_image) = api_response.data.get(0) {
                Ok(first_image.url.clone().to_string())
            } else {
                Err(GptError::ResponseError("No image URL found".to_string()))
            }
        } else {
            Err(GptError::NoApiKey)
        }
    }
}