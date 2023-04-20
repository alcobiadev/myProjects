let gameIsOver = false;
let score = 0;
let seconds = 0;
let bolts = [];

const ctx = document.getElementById("canvas").getContext("2d");
let speed = 2;

const sizeX = 80;
const sizeY = 160;

let mouseX = 0;
let mouseY = 0;

class Bolt {
	constructor(y) {
        let newX = Math.floor(Math.random() * window.innerWidth);
        newX = newX > window.innerWidth / 2 ? newX - 200 : newX + 200;
		this.x = newX;
		this.y = y;
	}

	draw() {
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - sizeX, this.y + sizeY / 2 - 20);
		ctx.lineTo(this.x - sizeX / 2 + 10, this.y + sizeY / 2);
		ctx.lineTo(this.x - sizeX, this.y + sizeY);
		ctx.lineTo(this.x, this.y + sizeY / 2);
		ctx.lineTo(this.x - sizeX / 2 - 10, this.y + sizeY / 2 - 20);
		ctx.lineTo(this.x, this.y);
		ctx.fill();
		ctx.stroke();
	}

	update() {
		this.y += speed;
		if (this.y >= window.innerHeight) {
			gameIsOver = true;
		}
	}
}

window.onload = () => {
	init();
};

setInterval(incrementSeconds, 1000);

function init() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	let audio = new Audio("resources/music.m4a");
	//audio.play();

	window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
	if (gameIsOver) {
		gameOver();
		return;
	}
	generateBolts();
	draw();
	update();

	window.requestAnimationFrame(gameLoop);
}

function generateBolts() {
	if (bolts.length > 3) {
		return;
	}

	while (bolts.length < 3) {
		bolts.push(new Bolt(100));
		console.log(bolts.length);
	}
}

function draw() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	let text = "Score: ";
	ctx.fillStyle = "#02db9e";
    ctx.strokeStyle = "black";
	ctx.font = "2.4rem sans-serif";
	ctx.fillText(text + score, 40, 40);
    ctx.strokeText(text + score, 40, 40);

    let timeText = "Timer: ";
    ctx.fillText(timeText + seconds, 260, 40);
    ctx.strokeText(timeText + seconds, 260, 40);

	bolts.forEach((bolt) => {
		bolt.draw();
	});
}

function update() {

	bolts.forEach((bolt) => {
		bolt.update();
	});
}

function checkUserInput() {
	let newBolts = bolts.filter(
		(bolt) =>
			!(
				mouseX > bolt.x - sizeX &&
				mouseX < bolt.x &&
				mouseY < bolt.y + sizeY &&
				mouseY > bolt.y
			)
	);
	if (newBolts < bolts) {
		score += bolts.length - newBolts.length;
        let audio = new Audio('resources/thunder.ogg');
        audio.play();
	}
	bolts = newBolts;
}

function incrementSeconds() {
    seconds += 1;
    if (seconds % 4 === 0) {
        speed += 0.5;
    }
}

function gameOver() {
    let audio = new Audio('resources/game-over.wav');
    audio.play();
	return;
}

document.addEventListener("click", (e) => {
	mouseX = e.x;
	mouseY = e.y;
	e.preventDefault();
	checkUserInput();
});
