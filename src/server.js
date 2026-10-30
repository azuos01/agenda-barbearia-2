import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { agendar } from './agenda.js';

const PORTA = process.env.PORTA || 3000;
let agenda = [];

function responder(res, status, corpo, tipo = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': tipo });
  res.end(typeof corpo === 'string' ? corpo : JSON.stringify(corpo));
}

createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
    return responder(res, 200, html, 'text/html; charset=utf-8');
  }
  if (req.url === '/api/agendamentos' && req.method === 'GET') {
    return responder(res, 200, agenda);
  }
  if (req.url === '/api/agendamentos' && req.method === 'POST') {
    let dados = '';
    for await (const parte of req) dados += parte;
    try {
      agenda = agendar(agenda, JSON.parse(dados));
      return responder(res, 201, agenda);
    } catch (erro) {
      return responder(res, 400, { erro: erro.message });
    }
  }
  responder(res, 404, { erro: 'Não encontrado' });
}).listen(PORTA, () => console.log(`Agenda da barbearia em http://localhost:${PORTA}`));
