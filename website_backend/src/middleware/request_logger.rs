use actix_web::{dev::{Service, Transform, ServiceRequest, ServiceResponse}, Error, HttpMessage};
use futures::future::{ok, Ready, LocalBoxFuture};
use std::task::{Context, Poll};
use std::pin::Pin;
use std::fs::OpenOptions;
use std::io::Write;

pub struct RequestLogger;

impl<S, B> Transform<S, ServiceRequest> for RequestLogger
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = RequestLoggerMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(RequestLoggerMiddleware { service })
    }
}

pub struct RequestLoggerMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for RequestLoggerMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&self, ctx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let peer_addr = req.peer_addr().map_or_else(|| "Unknown".to_string(), |addr| addr.to_string());
        if !peer_addr.contains("127.0.0.1")
        {
            println!("[SUS] Strange Request from IP: {}", peer_addr);
            // Log IP address to a file
            let mut file = OpenOptions::new()
                .create(true)
                .append(true)
                .open("request_ips.log")
                .expect("Failed to open or create file");
            writeln!(file, "{}", peer_addr).expect("Failed to write to file");
        }
        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            Ok(res)
        })
    }
}
