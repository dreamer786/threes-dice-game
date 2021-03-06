const dice1 = [{pinned: false, face: 0}, {pinned: false, face: 0}, {pinned: false, face: 0}, {pinned: false, face: 0}, {pinned: false, face: 0}];
let numList = [];
let computerScore = 0;
let playerScore = 0;
let game; 
let player;
let computer; 
let start;
let roll;
let pin;
let numPinned = 0;
let winner;
let numRolls = 0;

function diceRoll () {
	if (numList.length > 0){
		const num = numList.shift();
		return parseInt(num);
	} else {
		const rand = Math.floor(Math.random() * 6) + 1;
		return rand;
	}
}

function computerPlay () {
	let numPins = 5;
	//roll dice
	while (numPins > 0) {
		dice1.forEach(function (die){
			if (die.pinned === false){
				die.face = diceRoll();
			}
		});

		//find the minimum that is not pinned
		const minimum = dice1.reduce((min, curr) => {
			//if theres a 3, choose 3
			if (curr.face === 3 && curr.pinned === false){
				min = curr.face;
			} else if (curr.face < min && curr.pinned === false && min !== 3){
				min = curr.face;
			}
			return min;
		}, 6);
		//console.log("min ", minimum);
		//pin the minimum (doesnt matter if there are duplicates?)
		let found = false;
		dice1.forEach(function (die) {
			if (die.face === minimum && !found) {
				//console.log("pinned");
				die.pinned = true;
				found = true;
			}
		});

		if (minimum === 3) {
			computerScore += 0;
			computer.append("(0) ");
		} else {
			computerScore += minimum;
		}
		if (numPins === 1) {
			computer.append(minimum + " = ");
		} else {
			computer.append(minimum + " + ");
		}
		numPins --;
	}
	computer.append(computerScore);
	computer.style.visibility = "visible";
	player.style.visibility = "visible";

	//console.log("computer score ", computerScore);
	
	//disable start, enable roll
	start.disabled = true;
	roll.disabled = false;

	//const rollButton = document.querySelector("#roll");
	//rollButton.addEventListener('click', rollDie);

	//player's turn, unpin everything
	//let boxes = document.querySelector(".dice");
	dice1.forEach(function (die){
		if (die.pinned) {
			die.pinned = false;
		}
	});
}

function startGame(){
	const numbers = document.getElementsByName("diceValues")[0].value;
	if (numbers) {
		numList = numbers.split(",");
	}

	//remove title
	document.getElementById("intro").style.visibility = "hidden";
	
	//show game screen
	game = document.getElementById('game');
	game.classList.remove('hidden');
	game.style.visibility = "visible"; 

	//create dice by a div with 5 p tags that have borders
	const dice = document.createElement("div");
	dice.setAttribute("class", "dice");
	for (let i = 0; i < 5; i ++){
		const die = document.createElement("span");
		die.append("   ");
		//die.style.backgroundColor = "white";
		dice.appendChild(die);
	}
	//create start, roll, pin buttons
	start = document.createElement("button");
	start.append("Start");
	start.setAttribute("id", "start");
	roll = document.createElement("button");
	roll.append("Roll");
	roll.setAttribute("id", "roll");
	pin = document.createElement("button");
	pin.append("Pin");
	pin.setAttribute("id", "pin");
	roll.disabled = true;
	pin.disabled = true;

	player = document.createElement("p");
	player.append("Player Score: 0");
	player.style.visibility = "hidden";
	
	computer = document.createElement("p");
	computer.append("Computer score: ");
	computer.style.visibility = "hidden";

	winner = document.createElement("p");
	winner.setAttribute("id", "winner");
	winner.style.visibility = "hidden";

	game.appendChild(dice);
	game.appendChild(computer);
	game.appendChild(player);
	game.appendChild(start);
	game.appendChild(roll);
	game.appendChild(pin);
	game.appendChild(winner);
	const startButton = document.querySelector("#start");
	startButton.addEventListener('click', computerPlay);
	
	//listen for roll click
	const rollButton = document.querySelector("#roll");
	rollButton.addEventListener('click', function (){
		numRolls += 1;
		dice1.forEach(function (die){
			if (die.pinned === false){
				die.face = diceRoll();
			}
		});

		//display in DOM
		let diceIndex1 = 0;
		dice.childNodes.forEach((child) => {
			child.textContent = dice1[diceIndex1].face;
			diceIndex1 ++;
		});

		//enable pin
		pin.disabled = false;
		roll.disabled = true;
	});
	//listen for die clicks
	document.querySelectorAll("span").forEach(function (die) {
		die.addEventListener('click', function () {
			if (die.innerHTML === "   " && numRolls === 0){
				console.log("this ", this);
				const overlay = document.querySelector(".overlay");
				const errorMessage = document.querySelector(".modal");
				errorMessage.childNodes[0].textContent = "You must roll before you select a die";
				overlay.style.visibility = "visible";
			}
			else{
				die.style.cssText = "";
				die.classList.toggle("selected");
				console.log("die clicked");		
			}
		});
	});


	//check for any pinned dice
	pin.addEventListener('click', function () {
		let numSelected = 0;
		let diceIndex = 0;//use for pinning the dice1 object
		document.querySelectorAll("span").forEach(function(die){
			if (die.classList.contains("selected")){
				if (!die.classList.contains("pinned")){
					numPinned += 1;
					numSelected++;
					die.classList.toggle("pinned");
					if (dice1[diceIndex].face !== 3){
						playerScore += dice1[diceIndex].face;
					}
					console.log("player selected ", dice1[diceIndex].face);
					console.log("player score ", playerScore, " ");
				}
				if (die.classList.contains("unpinned")) {
					die.classList.toggle("unpinned");
				}

				dice1[diceIndex].pinned = true;
				//console.log("number of pinned dice in main function ", numPinned);
				//console.log("number of selected dice ", numSelected);
				player.textContent = "Player Score: " + playerScore;

			}
			if (numSelected === 0 && diceIndex === 4){
				const overlay = document.querySelector(".overlay");
				const errorMessage = document.querySelector(".modal");
				errorMessage.childNodes[0].textContent = "Choose at least one die to pin";
				overlay.style.visibility = "visible";
				pin.disabled = false;
				roll.disabled = true;
			}
			else{
				roll.disabled = false;
				pin.disabled = true;
			}
			
			diceIndex++;
		});
		//DETERMINE WINNER
		if (numPinned === 5){
			pin.disabled = true;
			roll.disabled = true;
			console.log("GAME OVER");
			player.textContent = "Player Score: " + playerScore;

			if (playerScore > computerScore) {
				winner.classList.add("lose");
				winner.textContent = "YOU LOSE";

			}
			else if (playerScore < computerScore) {
				winner.classList.add("win");
				winner.textContent = "YOU WIN";

			} else {
				winner.classList.add("tie");
				winner.textContent = "TIE";

			}
			winner.style.visibility = "visible";

		}		
	});	
	const overlay = document.querySelector(".overlay");
	const closeButton = document.querySelector(".closeButton");
	closeButton.addEventListener('click', function () {
		overlay.style.visibility = "hidden";
	});
}

document.addEventListener("DOMContentLoaded", function (event) {
	const go = document.querySelector('button');
	go.addEventListener('click', startGame);
});

