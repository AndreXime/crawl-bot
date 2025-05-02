import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';
import stripAnsi from 'strip-ansi';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Servir o HTML estático
app.use(express.static(path.join(process.cwd(), 'web')));
app.get('/', (_, res) => {
	res.sendFile(path.join(process.cwd(), 'web/index.html'));
});

// Processo CLI para controlar

wss.on('connection', (ws) => {
	console.log('Cliente conectado');

	let child: ChildProcessWithoutNullStreams | null = null;
	let args: string[] = [];

	ws.on('message', (msg: string) => {
		const input = msg.toString().trim();

		// Primeira mensagem: inicializa o processo com os args
		if (!child) {
			args = input.split(' ');
			child = spawn('npm', ['start', '--', ...args], {
				stdio: 'pipe',
				shell: true,
				cwd: process.cwd(),
			});

			child.stdout.on('data', (data) => {
				ws.send(stripAnsi(data.toString()));
			});

			child.stderr.on('data', (data) => {
				ws.send(stripAnsi(data.toString()));
			});

			child.on('close', (code) => {
				ws.send(`\nProcesso finalizado com código ${code}`);
				child = null;
			});

			ws.send(`Executando crawller com ${args.join(' ')}\n`);
			return;
		}

		// Se o processo ainda estiver rodando, envia input (se quiser estender)
		if (child && !child.killed) {
			child.stdin.write(input + '\n');
		}
	});
});

server.listen(3001, () => {
	console.log('Servidor rodando em http://localhost:3001');
});
