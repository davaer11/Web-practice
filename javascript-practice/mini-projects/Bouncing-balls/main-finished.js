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
	
	const panel_header = document.createElement('div');
	panel_header.setAttribute('class', 'panel-header');
	panel.appendChild(panel_header)
	
	const msg = document.createElement('p');
	msg.textContent = msgText;
	panel.appendChild(msg);
	
	const buttons = document.createElement('div');
	buttons.setAttribute('class', 'btns');
	panel_header.appendChild(buttons);
	
	const fullScreenBtn = document.createElement('button');
	fullScreenBtn.setAttribute('class', 'fullscreen-btn');
	fullScreenBtn.textContent = '[]';
	buttons.appendChild(fullScreenBtn);
	
	const closeBtn = document.createElement('button');
	closeBtn.setAttribute('class', 'close-btn');
	closeBtn.textContent = 'x';
	buttons.appendChild(closeBtn);
	
	/*fullScreenBtn.addEventListener('click', (e) => {
		
		if (!e.target.classList.contains('resize')) {
			
			msg.classList.add('resize');
		}
		else {
			panel.classList.remove('resize');
		}
		
		
	});*/
	
	
	/*fullScreenBtn.addEventListener('click', (e) => {
		
		if(!document.fullscreenElement) {
			
			e.target.requestFullscreen().catch((err) => {
				
				alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
				
			});
			
		}
		else {
			document.exitFullscreen();
		}
		
		
	});*/
	
	
	
	closeBtn.addEventListener('click', () => {
		
		panel.parentNode.removeChild(panel);
		
		//Start game again
		ctx.clearRect(0,0,width,height);
        ctx = canvas.getContext('2d');
		
		balls = [];
		count = 0;
		var player1 = new EvilCircle(40,40, "player1", 1);
		//var player2 = new EvilCircle(700,40, "player2", 2);
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

class EvilCircle extends Shape {
	
	constructor(x, y, name, which_one = 0) {
		super(x,y,20,20);
		this.color = "white";
		this.size = 10;
		this.game_over = false;
		this.name = name;
		this.which_one = which_one;
		
		this.update();
		
	}
	
	
	update() {
		if (this.which_one === 1 || this.which_one === 0) {
			
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
		else if (this.which_one == 2){
			
			window.addEventListener('keydown', e => {
				
			switch(e.code) {
					
				case "ArrowLeft":
					this.x -= this.velX;
					break;
				case "ArrowRight":
					this.x += this.velX;
					break;
				case "ArrowUp":
					this.y -= this.velY;
					break;
				case "ArrowDown":
					this.y += this.velY;
					break;
				}
				
			});
		}
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

//IDEJA napravit dijagonalno kretanje -za sada po strani
//IDEJA napravit izbor igranja - ili jedan igrač(prelazi po levelima) ili dva igrača jedan protiv drugoga
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
   
   
   player1.draw();
   player1.checkBounds();
   player1.collisionDetect();
   
  /* player2.draw();
   player2.checkBounds();
   player2.collisionDetect();*/
   
   
   
   my_requestID = window.requestAnimationFrame(loop);
   //IDEJA: Ako igraju 2 playera jedan protiv drugoga onda je dozvoljeno jedenje većih krugova(ili nikom ništa), ali oni te smanjuju. Krajnji ishod igre je pobjeda jednog od igrača
   if (player1.game_over /*|| player2.game_over*/) {
	  
	  stopAnimation(my_requestID);
	  displayMessage("Nažalost igra je gotova za vas!\n Ako želite ponovno igrati stisnite x.", "lose");
	  
   }
   
   
}
function stopAnimation(my_requestID) {
	window.cancelAnimationFrame(my_requestID);
	
}

function createBalls() {
	
	while (balls.length < 17) {
		const size = random(5,20); //10 do 20
		const ball = new Ball(
			// ball position always drawn at least one ball width
			// away from the edge of the canvas, to avoid drawing errors
			random(0 + size,width - size),
			random(0 + size,height - size),
			random(-2,2),
			random(-2,2),
			randomRGB(),
			size
		);

		balls.push(ball);
		count += 1;
		score_counter.textContent = `Balls: ${count}` ;
	}
	
}

var player1 = new EvilCircle(40,40, "player1", 1);
//var player2 = new EvilCircle(700,40, "player2", 2);
score_counter.textContent = `Balls: ${count}`;
createBalls();
loop();
