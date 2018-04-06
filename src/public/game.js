

var dice1 = [{pinned:false, face: 0},{pinned:false, face: 0},{pinned:false, face: 0},{pinned:false, face:0},{pinned:false, face:0}];
var dice = {first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined};
var rolls = [];
var numList = []; 
var computerScore = 0;
var playerScore;
var game; //game screen
var player;
var start;
var roll;
var pin;
document.addEventListener("DOMContentLoaded", function(event){
	const go = document.querySelector('button');
	go.addEventListener('click', startGame);
	

});
function startGame(){
		let numbers = document.getElementsByName("diceValues")[0].value;
		if (numbers){
			numList =  numbers.split(",");
		}

		console.log("num list", numList);
		//remove title
		document.getElementById("intro").style.visibility = "hidden";
		
		//show game screen
		game = document.getElementById('game');
		game.classList.remove('hidden');
		game.style.visibility = "visible"; 

		//create dice by a div with 5 p tags that have borders
		var dice = document.createElement("div");
		dice.setAttribute("class", "dice");
		for(let i = 0; i < 5; i ++){
			let die = document.createElement("span");
			die.append("   ");

			dice.appendChild(die);
		}
		//console.log(dice);
		//create start, roll, pin buttons
		start = document.createElement("button");
		start.append("Start");
		start.setAttribute("id", "start")
		roll = document.createElement("button");
		roll.append("Roll");
		roll.setAttribute("id", "roll");
		pin = document.createElement("button");
		pin.append("Pin");
		pin.setAttribute("id", "pin");
		roll.disabled = true;
		pin.disabled = true;

		game.appendChild(dice);
		game.appendChild(start);
		game.appendChild(roll);
		game.appendChild(pin);
		const startButton = document.querySelector("#start");
		//console.log("start button ", startButton);
		startButton.addEventListener('click', computerPlay);
		

	}
function computerPlay(){
	var computer = document.createElement("p");
	computer.append("Computer score: ");
	let numPins = 5;
	//roll dice
	while(numPins > 0) {
		dice1.forEach(function (die){
			if (die.pinned === false){
				die.face = diceRoll();
				//console.log("die ", die.face);
			}
		});
		console.log("computer dice ", dice1);

		//find the minimum that is not pinned
		let minimum = dice1.reduce((min, curr) =>{
			//if theres a 3, choose 3
			if (curr.face === 3 && curr.pinned === false){
				min = curr.face;
			}
			else if (curr.face < min && curr.pinned === false  && min !== 3){
				min = curr.face;
			}
			return min;
			
		}, 6);
		console.log("min ", minimum);
		//pin the minimum (doesnt matter if there are duplicates?)
		let found = false;
		dice1.forEach(function(die){
			if (die.face === minimum && !found){
				console.log("pinned");
				die.pinned = true;
				found = true;
			}
		});

		if (minimum === 3) {
			computerScore += 0;
			computer.append(" 0 (3) + ");
		}
		else{
			computerScore += minimum;
			if (numPins === 1){
				computer.append(minimum + " = ");
			}
			else{
				computer.append(minimum + " + ");
			}
		}
		numPins --;
	}
	computer.append(computerScore);
	game.appendChild(computer);


	console.log("computer score ", computerScore);
	player = document.createElement("p");
	player.append("Player Score: 0");
	game.appendChild(player);

	start.disabled = true;
	roll.disabled = false;

	const rollButton = document.querySelector("#roll");
	rollButton.addEventListener('click', rollDie);
}
	
function diceRoll(){
	//if there are numbers from the input, return first number, remove it from list
	if (numList.length > 0){
		//console.log("num roll die ", numList);
		let num = numList.shift();
		return parseInt(num);
	}
	else{
		let rand = Math.floor(Math.random() * 6) + 1;
		//console.log("random num ", rand);
		return rand;
	}
}

function rollDie(){
	//player's turn, unpin everything
	dice1.forEach(function (die){
		if (die.pinned){
			die.pinned = false;
		}
	});

	let numPins = 5;
	while(numPins > 0){
		dice1.forEach(function (die){
			if (die.pinned === false){
				die.face = diceRoll();
			}
		});
		console.log("player dice ", dice1);
		//display in DOM
		let boxes = document.querySelector(".dice");
		let diceIndex = 0;
		boxes.childNodes.forEach((children) => {
			children.textContent = dice1[diceIndex].face;
			diceIndex ++;
		});
 		numPins --;
	}
}

