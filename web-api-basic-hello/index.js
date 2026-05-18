// Web API Basic Hello
// Simples servidor HTTP que responde "Hello World" na raiz

const http = require('http');

const servidor = http.createServer((req, res) => {
    // Verifica se a requisição é para a rota raiz
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Hello World');
    } else {
        // Responde com 404 para outras rotas
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Rota não encontrada');
    }
});

// Define a porta
const PORT = 3000;

// Inicia o servidor
servidor.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
