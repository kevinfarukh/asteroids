const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d"); // Contexto de lo que queremos hacer en el canvas

canvas.width = window.innerWidth; // canvas esta full width
canvas.height = window.innerHeight;

context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height); // Crear el rectangulo y el tamaño, 1. lugar x, 2. lugar y, 3. width, 4. height

// Creating player
class Player {
  constructor({ position, velocity }) {
    this.position = position; // it's the x and y position {x,y}
    this.velocity = velocity;
  }
  draw() {
    context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    context.fillStyle = "red";
    context.fill();
    // context.fillStyle = "red";
    // context.fillRect(this.position.x, this.position.y, 100, 100);
    context.moveTo(this.position.x + 30, this.position.y); //inicia el punto
    context.lineTo(this.position.x - 10, this.position.y - 10); // crea la linea siguiendo las coordenadas
    context.lineTo(this.position.x - 10, this.position.y + 10);
    context.closePath();
    context.strokeStyle = "white";
    context.stroke();
  }
}
const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

player.draw();
console.log(player);
