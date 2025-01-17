const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d"); // Contexto de lo que queremos hacer en el canvas

canvas.width = window.innerWidth; // canvas esta full width
canvas.height = window.innerHeight;

context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height); // Crear el rectangulo y el tamaño, 1. lugar x, 2. lugar y, 3. width, 4. height
