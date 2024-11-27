import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import os from 'os'; // Para obtener la IP local

// Función para obtener la IP local, similar a la implementación en Go
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retorna la primera IP no interna
      }
    }
  }
  return 'Unknown';
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    middlewareMode: true, // Permite agregar middlewares personalizados
    setup: (server) => {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/') {
          // Renderizar una respuesta HTML similar a Go
          const templatePath = resolve(__dirname, 'index.html');
          const template = require('fs').readFileSync(templatePath, 'utf-8');

          // Datos para pasar a la plantilla
          const localIP = getLocalIP();
          const renderedTemplate = template.replace('{{ LocalIP }}', localIP);

          res.setHeader('Content-Type', 'text/html');
          res.end(renderedTemplate);
        } else {
          next();
        }
      });
    },
  },
});
