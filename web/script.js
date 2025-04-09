const socket = new WebSocket('ws://localhost:3001');
const output = document.getElementById('output');

const appendOutput = (text) => {
	output.textContent += text;
	output.scrollTop = output.scrollHeight;
};

socket.onmessage = (event) => {
	appendOutput(event.data);
};

document.getElementById('refresh').addEventListener('click', () => {
	location.reload();
});

document.getElementById('cls').addEventListener('click', () => {
	output.textContent = '';
});

document.getElementById('send').addEventListener('click', () => {
	const input1 = document.getElementById('input1').value.trim();
	const input2 = document.getElementById('input2').value.trim();
	const input3 = document.getElementById('input3').value.trim();
	const input4 = document.getElementById('input4').value.trim();

	const inputFinal = [input1, input2, input3, input4].join(' ');
	send;
	socket.send(inputFinal);
});
