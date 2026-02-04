module.exports = {
  apps: [
    {
      name: "fastapi-app",
      script: "gunicorn",
      args: "app:app -k uvicorn.workers.UvicornWorker -w 2 -b 0.0.0.0:3101",
      interpreter: "python3.12",
      env: {
        ENV: "production",
      }
    }
  ]
}
