module.exports = {
  apps: [
    {
      name: "hireco-be",
      script: "gunicorn",
      args: "app:app -k uvicorn.workers.UvicornWorker -w 2 -b 0.0.0.0:3101",
      interpreter: "python3.12",
      autorestart: true,
      env: {
        ENV: "production",
      }
    }
  ]
}
