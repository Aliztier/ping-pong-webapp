(d => {

// Set up a tournament player
class Player {
	constructor(name) {
		this.name = name;
		this.isWinner = false;
	}
}

// Set up the tournament
class Tournament {
	constructor() {
		this.players = [];
		this.pairs = [];
	}

	playerExists(name) {
		// Check whether player already exists before adding to the tournament
		let exists = false;
		this.players.map(player => {
			if (player.name === name) {
				exists = true;
			}
		});
		return exists;
	} 

	//every added play get pushed into the array
	addPlayer(newPlayer) {
		this.players.push(newPlayer);
	}

	Size() {
		let playersNum = this.players.length;

		// Don't create tournament if less than two players
		if (playersNum < 2) {
			return("short");
		}

		d.getElementById("add-players").classList.add("hidden");
		if (playersNum >= 2) {
			this.randomisePlayers();

			// Print the draw
			draw.classList.remove("hidden");
			this.createPairs();
			printGames();
			nextRound.classList.remove("hidden");
			
		} else {
			// if it's equal to 2 generate final match.
		}
	}

	
	randomisePlayers() {
		// Randomise the players at the beginning of each round so that byes are fairly shared
		let randomisedPlayers = [];
		let input = this.players;
		let len = input.length;
		for (let i = 0; i < len; i += 1) {
			let rand = Math.floor(Math.random() * Math.floor(input.length));//returning a random integer from nth to hoewver many players are in array.
			randomisedPlayers.push(input[rand]);
			let removed = input.splice(rand, 1);//returning the removed player from randon position for byes
		}
		this.players = randomisedPlayers;
	}

	createPairs(arr) {
		// Create the pairs for each match
		this.pairs = [];
		let pairing = arr === "winners" ? this.players.filter(player => player.isWinner) : this.players;
		for (let i = 0; i < pairing.length; i+=2) {
			(pairing[i+1]) ? this.pairs.push({player1: pairing[i].name, player2: pairing[i+1].name}) : this.pairs.push({player1: pairing[i].name, player2: "BYE"});
		}
	}

	generateMatches() {
		// Generate fragment to print out the matches
		let section = d.createElement("section");
		this.pairs.map((match, index) => {
			let div = d.createElement('div');
			let ul = d.createElement("ul")
			ul.classList.add("matchup");
			div.appendChild(ul);
			let li = d.createElement("li");
			li.className = "team team-top";
			li.textContent = match.player1;
			
			// Set a player with a bye to be a winner
			if (match.player2 === "BYE") {
				li.classList.add("winner-highlight");
				this.players.map(player => player.name === match.player1 ? player.isWinner = true : player);
			}
			ul.appendChild(li);
			li = d.createElement("li")
			li.className = "team team-bottom";
			li.textContent = match.player2;
			ul.appendChild(li);
			section.appendChild(div);
		});
		return section;
	}

	winnerReset() {
		// Set the winner status to false, as the round hasn't been played yet.
		this.players.map(player => player.isWinner = false);
	}


	reset() {
		this.pairs = [];
		this.players = [];
	}

}

// Set initial variables
let myForm = d.querySelector('#setup');
let input = d.querySelector('#name');
let msg = d.querySelector('.msg');
let output = d.querySelector('#players-list');
let draw = d.querySelector('#draw');
let drawList = d.querySelector('.draw-list');


let tournament = new Tournament();

// Gather user input and add names to players array
function onSubmit(e) {
	e.preventDefault();

	let name = input.value;

	// Validate input.  Don't accept blank values as players
	if (name.length < 1) {
		msg.classList.add('error');
    	msg.innerHTML = "Please enter the player's name";

	    // Remove error after 3 seconds
	    setTimeout(() => msg.remove(), 3000);
	} else {
		
		// Don't accept players with the same name as an existing player
		let exists = tournament.playerExists(name);

		if (exists) {
			msg.classList.add('error');
	    	msg.innerHTML = "This player is already in the tournament, please use a different name";

		    // Remove error after 3 seconds
		    setTimeout(() => msg.remove(), 3000);

		// Otherwise, add the player to the tournament
		} else {
			let newPlayer = new Player(name);
			tournament.addPlayer(newPlayer);
			 // Create new list item with user
			let li = d.createElement("li");

			// Add text node with input values
    		li.appendChild(document.createTextNode(`${input.value}`));

			// Add text node with input values
			output.appendChild(li);

			//clear Fields
			input.value = "";
		}
	}
	input.focus();
};

// Create the first games of the tournament
let createTournament = () => {

	// Check the size of the tournament
	let status = tournament.Size();
	status ? msg.textContent = "Enter at least 2 players to make a tournament" : null;
}

// Print the matches
let printGames = () => {
	tournament.winnerReset();
	let section = tournament.generateMatches();
	drawList.appendChild(section);
}


// Event handlers for buttons.
myForm.addEventListener('submit', onSubmit);
d.querySelector("#generate").addEventListener("click", createTournament);

})(document);