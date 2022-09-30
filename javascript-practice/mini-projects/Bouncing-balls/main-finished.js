// set up canvas

const canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const score_counter = document.querySelector('p');
var count = 0;
var balls = [];

/*document.body.addEventListener('animationend', () => {
	
	displayMessage("jea", "lose");
	
});*/

function displayMessage(msgText, msgType) { // lose or win
	
	const body = document.body;
	
	const panel = document.createElement('div');
	panel.setAttribute('class', 'msgBox');
	body.appendChild(panel);
	
	const msg = document.createElement('p');
	msg.textContent = msgText;
	panel.appendChild(msg);
	
	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'x';
	panel.appendChild(closeBtn);
	
	closeBtn.addEventListener('click', () => {
		
		panel.parentNode.removeChild(panel);
		
		//Start game again
		ctx.clearRect(0,0,width,height);
        ctx = canvas.getContext('2d');
		
		balls = [];
		count = 0;
		evilCircle = new EvilCircle(40,40);
		createBalls();
		loop();
		
	});
	
}

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}


class Shape {
	
	constructor(x, y, velX, velY) {
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
	}		
}
//svaki put kad evilCircle pojede naraste za pola radijusa kruga kojeg je pojeo. Evil Circle može jesti samo krugove koji su veći od njega - 1. IDEJA
//Ako proba pojesti veći krug onda umire - 1.IDEJA

class Rectangle extends Shape {
	
	constructor(x,y) {
		super(x,y,0,0);
		this.width = 120;
		this.height = 80;
		this.color = "blue";
		this.clicked = false;
		
	}
	
	draw() {
		
	  ctx.beginPath();
      ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	  
	}
	
	
}

class EvilCircle extends Shape {
	
	constructor(x, y) {
		super(x,y,20,20);
		this.color = "white";
		this.size = 10;
		this.game_over = false;
		
		window.addEventListener('keydown', e => {
			
			switch(e.key) {
				
				case "a":
					this.x -= this.velX;
					break;
				case "d":
					this.x += this.velX;
					break;
				case "w":
					this.y -= this.velY;
					break;
				case "s": 
					this.y += this.velY;
					break;
			}
		});
	}
	
	draw() {
		
	  ctx.beginPath();
      ctx.strokeStyle = this.color;
	  ctx.lineWidth = 3;
	  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
	}
	
	checkBounds() {
		
	  if ((this.x + this.size) >= width) {
         this.x = -(this.size);
      }

      if ((this.x - this.size) <= 0) {
         this.x = +(this.size);
      }

      if ((this.y + this.size) >= height) {
         this.y = -(this.size);
      }

      if ((this.y - this.size) <= 0) {
         this.y = +(this.size);
      }
   			
	}
	
	collisionDetect() {
      for (const ball of balls) {
         if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
				if (ball.size <= this.size) { //Ako je lopta koju jedem manja ili jednaka meni pojedi ju i narasti za veličinu lopta koju si pojeo.
						ball.exists = false;
						count -= 1;
						score_counter.textContent = `Balls: ${count}` ;
						this.size += ball.size / 2 ;
						
					}		
				else { // Inače je igra gotova
					this.game_over = true;
				}
              
			}
         }
      }
   }
}

class Ball extends Shape {

   constructor(x, y, velX, velY, color, size) {
	   
	  super(x,y,velX,velY); 
      this.color = color;
      this.size = size;
	  this.exists = true;
   }

   draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
   }

   update() {
      if ((this.x + this.size) >= width) {
         this.velX = -(this.velX);
      }

      if ((this.x - this.size) <= 0) {
         this.velX = -(this.velX);
      }

      if ((this.y + this.size) >= height) {
         this.velY = -(this.velY);
      }

      if ((this.y - this.size) <= 0) {
         this.velY = -(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
   }

   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
         }
      }
   }

}

//IDEJA napravit dijagonalno kretanje
//IDEJA ako su sve kuglice veće od igračevih kuglica napravit jedan pravokutnik na koji treba kliknut(stisnut neku tipku kako bi sto brze mogao pojest) da se izgenerira nova kuglica koja je sigurno manja od trenutne veličine kuglice. Kuglica će se stvorit jedino ako nijedna kuglica trenutno nije manja od kuglice igrača.
//IDEJA - napravit dva igrača i svaki od igrača jede kuglice i cilj je svakom igraču pojest barem 4 kuglice nakon kojih bilo kad može pojest svog protivnika. onaj koji to prvi uspije je pobjednik.
function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   for (const ball of balls) {
	 if (ball.exists) {
		 
		 ball.draw();
		 ball.update();
		 ball.collisionDetect();		
	 }
    
   }
   rectangle.draw();
   
   evilCircle.draw();
   evilCircle.checkBounds();
   evilCircle.collisionDetect();
   
   my_requestID = window.requestAnimationFrame(loop);
   
   if (evilCircle.game_over) {
	  
	  stopAnimation(my_requestID);
	  displayMessage("Nažalost igra je gotova za vas!\n Ako želite ponovno igrati stisnite x.", "lose");
	  
   }
   
   
}
function stopAnimation(my_requestID) {
	window.cancelAnimationFrame(my_requestID);
	
}

function createBalls() {
	
	while (balls.length < 17) {
		const size = random(10,40); //10 do 20
		const ball = new Ball(
			// ball position always drawn at least one ball width
			// away from the edge of the canvas, to avoid drawing errors
			random(0 + size,width - size),
			random(0 + size,height - size),
			random(-5,5),
			random(-5,5),
			randomRGB(),
			size
		);

		balls.push(ball);
		count += 1;
		score_counter.textContent = `Balls: ${count}` ;
	}
	
}


var evilCircle = new EvilCircle(40,40);
var rectangle = new Rectangle(30, 600);
score_counter.textContent = `Balls: ${count}`;
createBalls();

loop();
