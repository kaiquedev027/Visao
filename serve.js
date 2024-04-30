const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar middleware para servir arquivos estáticos da pasta 'api'
app.use(express.static(path.join(__dirname, '/api')));

// Configurar proxy para encaminhar solicitações para o aplicativo Python
const proxy = httpProxy.createProxyServer();
app.use('/', (req, res) => {
  proxy.web(req, res, { target: 'http://127.0.0.1:5000' }); // Ajuste o endereço conforme necessário
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
