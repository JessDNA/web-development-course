// Web API de Utilitários
// Servidor HTTP com rotas para processamento de texto e números

const http = require('http');
const url = require('url');

const servidor = http.createServer((req, res) => {
    // Configura headers
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Faz parse da URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // ============ UTILITÁRIO DE TEXTO ============
    // Rota: POST /text/:action
    if (req.method === 'POST' && pathname.startsWith('/text/')) {
        // Extrai a ação da URL (ex: /text/lowercase -> 'lowercase')
        const action = pathname.split('/')[2];

        // Coleta o corpo da requisição
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // Faz parse do JSON do corpo
                const data = JSON.parse(body);
                const input = data.input || '';

                let output = '';

                // Processa de acordo com a ação
                if (action === 'lowercase') {
                    output = input.toLowerCase();
                } else if (action === 'uppercase') {
                    output = input.toUpperCase();
                } else {
                    res.writeHead(400);
                    res.end(JSON.stringify({ erro: 'Ação inválida. Use: lowercase ou uppercase' }));
                    return;
                }

                // Responde com sucesso
                res.writeHead(200);
                res.end(JSON.stringify({ entrada: input, acao: action, saida: output }));
            } catch (erro) {
                res.writeHead(400);
                res.end(JSON.stringify({ erro: 'Corpo da requisição inválido' }));
            }
        });
    }

    // ============ UTILITÁRIO DE NÚMERO ============
    // Rota: GET /number/:action?input=10,1,100
    else if (req.method === 'GET' && pathname.startsWith('/number/')) {
        // Extrai a ação da URL (ex: /number/minimum -> 'minimum')
        const action = pathname.split('/')[2];
        const input = query.input || '';

        try {
            // Converte string de números separados por vírgula em array de números
            const numeros = input
                .split(',')
                .map(n => parseFloat(n.trim()))
                .filter(n => !isNaN(n));

            if (numeros.length === 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ erro: 'Nenhum número válido fornecido' }));
                return;
            }

            let saida = null;

            // Processa de acordo com a ação
            if (action === 'minimum') {
                saida = Math.min(...numeros);
            } else if (action === 'maximum') {
                saida = Math.max(...numeros);
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({ erro: 'Ação inválida. Use: minimum ou maximum' }));
                return;
            }

            // Responde com sucesso
            res.writeHead(200);
            res.end(JSON.stringify({ entrada: input, acao: action, saida: saida }));
        } catch (erro) {
            res.writeHead(400);
            res.end(JSON.stringify({ erro: 'Erro ao processar números' }));
        }
    }

    // ============ ROTA NÃO ENCONTRADA ============
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
});

// Define a porta
const PORT = 3001;

// Inicia o servidor
servidor.listen(PORT, () => {
    console.log(`Servidor de Utilitários rodando em http://localhost:${PORT}`);
    console.log('');
    console.log('Exemplos de uso:');
    console.log('  POST http://localhost:3001/text/lowercase');
    console.log('    Body: {"input":"Lorem Ipsum"}');
    console.log('');
    console.log('  GET http://localhost:3001/number/minimum?input=10,1,100');
});
