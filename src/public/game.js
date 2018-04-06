document.addEventListener("DOMContentLoaded", function(event){
	const go = document.querySelector('button');
	console.log("go ", go);
	go.addEventListener('click', startGame);
	let dice = {first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined};
	let numberList = [];
	function startGame(){
		let numbers = document.getElementsByName("diceValues")[0].value;
		numList = numbers.split(",");
		if (numList.length === 0){
			diceRoll();
		}
		else{
			numberList = numList;
		}
		//remove title
		document.getElementById("intro").style.visibility = "hidden";
		/*
		const div = document.getElementById("#intro");
		while(div.firstChild){
			div.removeChild(div.firstChild);
		}
		*/
		//show game screen
		let game = document.getElementById('game');
		game.classList.remove('hidden');
		game.style.visibility = "visible"; 
		//create dice by a div with 5 p tags that have borders
		let dice = document.createElement("div");
		for(let i = 0; i < 5; i ++){
			let die = document.createElement("p");
			die.append("   ");

			dice.appendChild(die);
		}
		console.log(dice);
		//create start, roll, pin buttons
		let start = document.createElement("button");
		start.append("Start");
		let roll = document.createElement("button");
		roll.append("Roll");
		let pin = document.createElement("button");
		pin.append("Pin");
		roll.disabled = true;
		pin.disabled = true;

		game.appendChild(dice);
		game.appendChild(start);
		game.appendChild(roll);
		game.appendChild(pin);

	}
});

	
function diceRoll(){
	//return first number, remove it from list
	if (numberList.length > 0){
		return numberList.shift();
	}
	return Math.floor(Math.random() * 6) + 1;
}

