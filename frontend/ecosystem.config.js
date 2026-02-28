module.exports = {
  apps: [
    {
      name: 'hireco-fe',
      script: '.next/standalone/server.js',
      args: 'start', // Atau 'server.js' jika menggunakan standalone mode
      instances: 2, // Memanfaatkan Cluster Mode (semua core CPU)
      exec_mode: 'cluster', 
      autorestart: true,
      watch: false,
      max_memory_restart: '1G', // Restart jika konsumsi RAM melebihi 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3100
      }
    }
  ]
};