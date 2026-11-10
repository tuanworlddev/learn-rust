use std::{
    env,
    error::Error,
    net::{Ipv4Addr, SocketAddr},
};

use learn_rust_task_api::{app, database};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "learn_rust_task_api=info,tower_http=debug".into()),
        )
        .init();

    let port: u16 = env::var("TASK_API_PORT")
        .unwrap_or_else(|_| "3031".into())
        .parse()?;
    let database_path = env::var("TASK_API_DB").unwrap_or_else(|_| "tasks.db".into());
    let pool = database::open_database(database_path).await?;
    database::migrate(&pool).await?;
    let address = SocketAddr::from((Ipv4Addr::LOCALHOST, port));
    let listener = tokio::net::TcpListener::bind(address).await?;
    tracing::info!(address = %listener.local_addr()?, "task API listening on loopback");

    axum::serve(listener, app(pool.clone()))
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    pool.close().await;
    tracing::info!("database pool closed; shutdown complete");
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        if let Err(error) = tokio::signal::ctrl_c().await {
            tracing::error!(%error, "could not register Ctrl+C; initiating shutdown");
        }
    };
    #[cfg(unix)]
    let terminate = async {
        match tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
            Ok(mut signal) => {
                signal.recv().await;
            }
            Err(error) => {
                tracing::error!(%error, "could not register SIGTERM; initiating shutdown");
            }
        }
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }
    tracing::info!("shutdown requested; finishing in-flight requests");
}
