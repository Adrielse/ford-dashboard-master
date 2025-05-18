import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';
import cors from 'cors';

// 1. Configuração inicial
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

// 2. Middlewares para o backend
app.use(cors());
app.use(bodyParser.json());



// 5. Servir arquivos estáticos (Angular)
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false,
}));


app.use('/**', (req, res, next) => {
  // Se for uma rota de API, passa para o próximo middleware
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  
  // Caso contrário, renderiza com Angular SSR
  angularApp.handle(req)
    .then((response) => response ? writeResponseToNodeResponse(response, res) : next())
    .catch(next);
});

// 7. Inicialização do servidor
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API: http://localhost:${port}/api`);
    console.log(`Frontend: http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);