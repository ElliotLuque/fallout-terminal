const COLUMNS = 2;
const LINES = 17;
const SYMBOLS_PER_LINE = 12;
const MIN_WORD_SEPARATION = 4;

const SYMBOLS = [
	"<",
	">",
	"{",
	"}",
	",",
	".",
	";",
	":",
	"-",
	"_",
	"|",
	"\\",
	"@",
	"#",
	"$",
	"%",
	"&",
	"/",
	"(",
	")",
	"?",
	"!",
	"*",
	"^",
	"[",
	"]",
	"=",
	"+",
	"'",
	'"',
	"~",
];

const LETTERS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
];

const EASY_WORDS = [
	"STORY",
	"PLAYER",
	"BUILD",
	"LEARN",
	"VAULT",
	"FIGHT",
	"GAMES",
	"CHILD",
	"SUITS",
	"NORTH",
	"TRIBE",
	"CLAWS",
	"TEETH",
	"SIXTY",
	"EVENT",
	"ALLEY",
	"STAIR",
	"RANKS",
	"CRAZY",
	"KINDS",
];

const MEDIUM_WORDS = [
	"SYNOPSIS",
	"CHARACTER",
	"STUMBLES",
	"PROTECTED",
	"PEOPLE",
	"TROOPS",
	"WEAPONS",
	"DIGITAL",
];
const HARD_WORDS = [
	"TRANSMITTER",
	"UNEXPECTED",
	"PLATFORM",
	"ATTACKERS",
	"FORGOTTEN",
];

const DIFFICULTY_SETTINGS = {
	VERY_EASY: { words: 5, length: 5, list: EASY_WORDS },
	EASY: { words: 8, length: 5, list: EASY_WORDS },
	MEDIUM: { words: 11, length: 5, list: MEDIUM_WORDS },
	HARD: { words: 14, length: 5, list: HARD_WORDS },
	VERY_HARD: { words: 17, length: 5, list: HARD_WORDS },
};

const DIFFICULTY = DIFFICULTY_SETTINGS.VERY_EASY;
const ATTEMPTS = 4;

document.addEventListener("DOMContentLoaded", () => {
	initPointers();
	initEntries();
});

const volumebtn = document.getElementById("volume-btn");
volumebtn.addEventListener("click", () => {
	const idle = new Howl({
		src: ["assets/sounds/idle.wav"],
		volume: 0.2,
		loop: true,
	});
	idle.play();
});

function randomSingleSound() {
	const randomSound = Math.floor(Math.random() * 6) + 1;
	const sound = new Howl({
		src: [`assets/sounds/single/single0${randomSound}.wav`],
		volume: 0.5,
	});
	return sound;
}

function randomMultipleSound() {
	const randomSound = Math.floor(Math.random() * 4) + 1;
	const sound = new Howl({
		src: [`assets/sounds/multiple/multiple0${randomSound}.wav`],
		volume: 0.5,
	});
	return sound;
}

function randomEnterSound() {
	const randomSound = Math.floor(Math.random() * 3) + 1;
	const sound = new Howl({
		src: [`assets/sounds/enter/enter0${randomSound}.wav`],
		volume: 0.5,
	});
	return sound;
}

function initPointers() {
	const randomHexNumber = Math.floor(Math.random() * 2048);
	const base = "0xF";

	const pointerColumn1 = document.getElementById("point1");
	const pointerColumn2 = document.getElementById("point2");

	for (i = 0; i < LINES * COLUMNS; i++) {
		const pointerNumber =
			randomHexNumber + i * 10 + Math.floor(Math.random() * 10);
		let pointerNumberHexString = pointerNumber.toString(16).toUpperCase();

		if (pointerNumberHexString.length < 3) {
			pointerNumberHexString += String(Math.floor(Math.random() * 10));
		}

		const pointer = base + pointerNumberHexString;

		const pointerElement = document.createElement("span");
		const pointerTextNode = document.createTextNode(pointer);
		pointerElement.appendChild(pointerTextNode);

		if (i < LINES) {
			pointerColumn1.appendChild(pointerElement);
		} else {
			pointerColumn2.appendChild(pointerElement);
		}
	}
}

function initEntries() {
	const entriesColumn1 = document.getElementById("entries1");
	const entriesColumn2 = document.getElementById("entries2");
	
	const BRACKETS = new Map([
		["<", ">"],
		["{", "}"],
		["(", ")"],
		["[", "]"],
	]);

	entriesColumn1.addEventListener("mouseover", (event) => {
		const entries = [
			...entriesColumn1.childNodes,
			...entriesColumn2.childNodes,
		];
		entries.forEach((entry) => {
			if (event.target === entry) {
				entry.classList.add("highlight");
				
				if (entry.classList.contains("word")) {
					randomMultipleSound().play();
				} else {
					randomSingleSound().play();
				}

				const entryText = entry.textContent;

				BRACKETS.forEach((right, left) => {
					if (entryText === left) {
						const position = entries.indexOf(entry);

						// Find closing bracket
						for (i = position + 1; i <= entries.length; i++) {
							// Max length
							if (i - position > 6) {
								break;
							}

							// No words in between
							if (LETTERS.includes(entries[i].textContent)) {
								break;
							}

							// No another left bracket in between
							if (entries[i].textContent === entryText) {
								break;
							}

							// Found right closing bracket
							if (entries[i].textContent === BRACKETS.get(entryText)) {
								const positionEnd = entries.indexOf(entries[i]);

								for (j = position + 1; j <= positionEnd; j++) {
									setTimeout(() => {
										randomSingleSound().play();
									}, 130);
									entries[j].classList.add("highlight");
								}
								break;
							}
						}
					} else if (entryText === right) {
						const position = entries.indexOf(entry);

						// Find closing bracket
						for (i = position - 1; i >= 0; i--) {
							// Max length
							if (position - i > 6) {
								break;
							}

							// No words in between
							if (LETTERS.includes(entries[i].textContent)) {
								break;
							}

							// No another right bracket in between
							if (entries[i].textContent === entryText) {
								break;
							}

							// Found left closing bracket
							if (
								entries[i].textContent === getKeyByValue(BRACKETS, entryText)
							) {
								const positionEnd = entries.indexOf(entries[i]);

								for (j = position; j >= positionEnd; j--) {		
									setTimeout(() => {
										randomSingleSound().play();
									}, 130);
									entries[j].classList.add("highlight");
								}
								break;
							}
						}
					}
				});
			}
		});
	});

	entriesColumn1.addEventListener("mouseout", (event) => {
		const entries = entriesColumn1.childNodes;
		entries.forEach((entry) => {
			entry.classList.remove("highlight");
		});
	});

	entriesColumn2.addEventListener("mouseover", () => {});

	const words = getRandomWords();
	const winnerWord = randomFromArray(words);

	// Fill symbols
	for (i = 0; i < SYMBOLS_PER_LINE * LINES * COLUMNS; i++) {
		if (i < (SYMBOLS_PER_LINE * LINES * COLUMNS) / 2) {
			const entryElement = document.createElement("span");
			const entryTextNode = document.createTextNode(randomFromArray(SYMBOLS));
			entryElement.appendChild(entryTextNode);
			entriesColumn1.appendChild(entryElement);
		} else {
			const entryElement = document.createElement("span");
			const entryTextNode = document.createTextNode(randomFromArray(SYMBOLS));
			entryElement.appendChild(entryTextNode);
			entriesColumn2.appendChild(entryElement);
		}
	}

	let randomPosition = Math.floor(
		(Math.random() * (SYMBOLS_PER_LINE * LINES * COLUMNS))
	);

	// Fill words in random positions and remove symbols
	words.forEach((word) => {
		

		if (randomPosition > (SYMBOLS_PER_LINE * LINES * COLUMNS) - DIFFICULTY.length + 1) {
			randomPosition -= DIFFICULTY.length;
		} 

		console.log("\nBEFORE ==> " + randomPosition)
		if (randomPosition > (SYMBOLS_PER_LINE * LINES * COLUMNS) - DIFFICULTY.length + 1) {
			randomPosition -= DIFFICULTY.length;
		}

		console.log("AFTER ==> " + randomPosition)

		const entries = [
			...entriesColumn1.childNodes,
			...entriesColumn2.childNodes,
		];

		randomPosition += 10;
	});

}

function getMatch() {}

// UTILS
function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function getKeyByValue(map, searchValue) {
	for (const [key, value] of map.entries()) {
		if (value === searchValue) {
			return key;
		}
	}
	return null;
}

function getRandomWords() {
	const randomWords = [];

	for (i = 0; i < DIFFICULTY.words; i++) {
		const randomWord =
			DIFFICULTY.list[Math.floor(Math.random() * DIFFICULTY.list.length)];
		if (randomWords.includes(randomWord)) {
			i--;
			continue;
		}
		randomWords.push(randomWord);
	}

	return randomWords;
}


const gameStatus = document.getElementById("term-status");
if (ATTEMPTS === 1) {
	gameStatus.textContent = "!!! WARNING: LOCKOUT IMMINENT !!!";
	gameStatus.classList.add("blink");
}
