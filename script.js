// adjusting game

let SPEED = 3;
let ROTATION = 0.04;
let FRICTION = 0.97;
let PROJECTILE_SPEED = 4;

const speedInput = document.getElementById("speed");
const rotationInput = document.getElementById("rotation");
const projectileSpeedInput = document.getElementById("projectile_speed");
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  SPEED = speedInput.value;
  ROTATION = rotationInput.value / 100;
  PROJECTILE_SPEED = projectileSpeedInput.value;
  console.log(SPEED);
});

// Creating game

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d"); // Contexto de lo que queremos hacer en el canvas

canvas.width = window.innerWidth; // canvas esta full width
canvas.height = window.innerHeight;

// Creating player
class Player {
  constructor({ position, velocity }) {
    this.position = position; // it's the x and y position {x,y}
    this.velocity = velocity;
    this.rotation = 0;
  }
  draw() {
    context.save(); //usando el .save y abajo el .restore creamos un contexto para lo que esta encerrado

    context.translate(this.position.x, this.position.y); // translada el punto de centro de la esquina al centro
    context.rotate(this.rotation); //rotacion
    context.translate(-this.position.x, -this.position.y); //regresa a lo normal

    context.beginPath();
    context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
    // context.fillStyle = "red";
    // context.fillRect(this.position.x, this.position.y, 100, 100);

    // dibujo del jugador
    context.beginPath();
    context.moveTo(this.position.x + 30, this.position.y); //inicia el punto
    context.lineTo(this.position.x - 10, this.position.y - 10); // crea la linea siguiendo las coordenadas
    context.lineTo(this.position.x - 10, this.position.y + 10);
    context.closePath();
    context.strokeStyle = "white";
    context.stroke();
    context.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y < 10) this.position.y = 10;
    if (this.position.y > canvas.height - 10)
      this.position.y = canvas.height - 10;
    if (this.position.x < 10) this.position.x = 10;
    if (this.position.x > canvas.width - 10)
      this.position.x = canvas.width - 10;
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    ); //draw circle
    context.closePath();
    context.fillStyle = "white";
    context.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    ); //draw circle
    context.closePath();
    context.strokeStyle = "white";
    context.stroke();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const projectiles = [];
const asteroids = [];

window.setInterval(() => {
  const index = Math.floor(Math.random() * 4);
  let x, y;
  let vx, vy;
  let radius = 50 * Math.random() + 10;

  switch (index) {
    case 0: // lado izquierdo
      x = 0 - radius;
      y = Math.random() * canvas.height;
      vx = 1;
      vy = 0;
      break;
    case 1: // abajo
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
      vx = 0;
      vy = -1;
      break;
    case 2: // derecha
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
      vx = -1;
      vy = 0;
      break;
    case 3: // arriba
      x = Math.random() * canvas.width;
      y = 0 - radius;
      vx = 0;
      vy = 1;
      break;
  }
  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx,
        y: vy,
      },
      radius,
    })
  );
  console.log(asteroids);
}, 3000);

function animate() {
  window.requestAnimationFrame(animate);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height); // Crear el rectangulo y el tamaño, 1. lugar x, 2. lugar y, 3. width, 4. height

  player.update();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();
    // Eliminar del array para no tener basura coleccionandose
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }
  }

  // player.velocity.x = 0;
  // player.velocity.y = 0;
  if (keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED; // se usa el coseno para encontrar el angulo que se va a usar para ir hacia adelante
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else if (keys.s.pressed) {
    player.velocity.x = -Math.cos(player.rotation) * SPEED;
    player.velocity.y = -Math.sin(player.rotation) * SPEED;
  } else if (!keys.w.pressed) {
    player.velocity.x *= FRICTION; // para desacelerar el jugador
    player.velocity.y *= FRICTION;
  }
  if (keys.d.pressed) {
    player.rotation += ROTATION;
  } else if (keys.a.pressed) {
    player.rotation -= ROTATION;
  }
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      keys.w.pressed = true;
      break;
    case "KeyA":
      keys.a.pressed = true;
      break;
    case "KeyS":
      keys.s.pressed = true;
      break;
    case "KeyD":
      keys.d.pressed = true;
      break;
    case "Space":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30, // sumado con el coseno hace que el proyectil se dispare en la rotación y el 30 es la diferencia para que no dispare desde el centro sino desde la cabeza del jugador
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED, // para que dispare hacia la dirección
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      );
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyS":
      keys.s.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
  }
});
