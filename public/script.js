const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const socket = io();

let drawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

socket.on('drawing', (data) => {
    drawLine(data.x0, data.y0, data.x1, data.y1);
});

function startDrawing(e) {
    drawing = true;
    const { x, y } = getMousePos(e);
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath(); // Comenzar un nuevo trazo
}

function draw(e) {
    if (!drawing) return;

    const { x, y } = getMousePos(e);
    const lastX = ctx.lastX || x;
    const lastY = ctx.lastY || y;

    socket.emit('drawing', {
        x0: lastX,
        y0: lastY,
        x1: x,
        y1: y
    });

    drawLine(lastX, lastY, x, y);
    ctx.lastX = x;
    ctx.lastY = y;
}

function drawLine(x0, y0, x1, y1) {
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.beginPath();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
