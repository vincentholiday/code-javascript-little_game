var theBoard = {
	space : '=',
	turn : 'O',
	boardData : {
		'top-L' : '=',
		'top-M' : '=',
		'top-R' : '=',
		'mid-L' : '=',
		'mid-M' : '=',
		'mid-R' : '=',
		'low-L' : '=',
		'low-M' : '=',
		'low-R' : '='
	},
	writeln : function(str) {
		var ele = document.getElementById("tic_tac_toe_message");
		ele.innerHTML = str;
	},
	clearBoard : function() {
		var ele = document.getElementById("tic_tac_toe_board");
		ele.innerHTML = '';
		this.printBoard();
	},
	clearData : function() {
		for ( var key in theBoard.boardData) {
			theBoard.boardData[key] = '=';
			this.turn = 'O';
		}
	},
	printBoard : function() {
		var tableHead = "<table>";
		var row1 = "<tr><td>" + this.boardData['top-L'] + "</td><td>"
				+ this.boardData['top-M'] + "</td><td>"
				+ this.boardData['top-R'] + "</td></tr>";
		var row2 = "<tr><td>" + this.boardData['mid-L'] + "</td><td>"
				+ this.boardData['mid-M'] + "</td><td>"
				+ this.boardData['mid-R'] + "</td></tr>";
		var row3 = "<tr><td>" + this.boardData['low-L'] + "</td><td>"
				+ this.boardData['low-M'] + "</td><td>"
				+ this.boardData['low-R'] + "</td></tr>";
		var tableTail = "</table>";
		var positionStr = "Position: low-L, low-M, low-R, mid-L, mid-M, mid-R, top-L, top-M, top-R";
		var str = tableHead + row1 + row2 + row3 + tableTail + "<br/>"
				+ positionStr;
		var ele = document.getElementById("tic_tac_toe_board");
		ele.innerHTML = str;
	},
	/**
	 * 
	 * @param symbol
	 * @returns if this turn won by the symbol
	 */
	isWon : function(boardData, symbol) {
		var s = symbol;
		// rows
		if (boardData['top-L'] == s && boardData['top-M'] == s
				&& boardData['top-R'] == s)
			return true;
		if (boardData['mid-L'] == s && boardData['mid-M'] == s
				&& boardData['mid-R'] == s)
			return true;
		if (boardData['low-L'] == s && boardData['low-M'] == s
				&& boardData['low-R'] == s)
			return true;
		// columns
		if (boardData['top-L'] == s && boardData['mid-L'] == s
				&& boardData['low-L'] == s)
			return true;
		if (boardData['top-M'] == s && boardData['mid-M'] == s
				&& boardData['low-M'] == s)
			return true;
		if (boardData['top-R'] == s && boardData['mid-R'] == s
				&& boardData['low-R'] == s)
			return true;
		// diagonal
		if (boardData['top-L'] == s && boardData['mid-M'] == s
				&& boardData['low-R'] == s)
			return true;
		if (boardData['top-R'] == s && boardData['mid-M'] == s
				&& boardData['low-L'] == s)
			return true;
		return false;
	},
	isBoardFull : function() {
		for ( var key in theBoard.boardData) {
			if (theBoard.boardData[key] == '=')
				return false;
		}
		return true;
	},
	isValidInput : function(move) {
		if (move && move != '') {
			move = move.trim();
			if (move in this.boardData)
				if (this.boardData[move] == this.space) { // 下的是空格
					this.move = move;
					return true;
				}
		}

		return false;
	},
	showResetButton : function(bool) {
		var resetButton = document.getElementById("reset_button");
		if (bool) {
			resetButton.style.display = 'inline';
		} else {
			resetButton.style.display = 'none';
		}
	},
	showInputButton : function(bool) {
		var inputButton = document.getElementById("input_button");
		var inputText = document.getElementById("input_text");
		if (bool) {
			inputButton.style.display = 'inline';
			inputText.style.display = 'inline';
		} else {
			inputButton.style.display = 'none';
			inputText.style.display = 'none';
			inputText.value = '';
		}
	}
};

var tttAI = {
	stupidAI : {
		/**
		 * return a best move position
		 */
		queryBestMove : function(turn, move, boardData) {
			// 下了就會贏的
			// 阻止別人贏
			// 隨機找一個點下
		}
	}
};

var theController = {
	enterMove : function() {
		var move = document.getElementById("input_text").value;

		if (theBoard.isValidInput(move)) {
			this.move();
		} else {
			theBoard
					.writeln('The move is invalid, please enter your move correctly!');
		}
	},
	/**
	 * move and after move
	 */
	move : function() {
		theBoard.boardData[theBoard.move] = theBoard.turn; // 下了一步

		if (theBoard.isWon(theBoard.boardData, theBoard.turn)) {
			// won
			theBoard.printBoard();
			theBoard.writeln('<b style="color:red">The winner is '
					+ theBoard.turn + '! Congratulation!</b>');
			theBoard.showInputButton(false);
			theBoard.showResetButton(true);
		} else {
			// no winner
			if (theBoard.turn == 'X')
				theBoard.turn = 'O';
			else
				theBoard.turn = 'X';
			theBoard.printBoard();
			if (theBoard.isBoardFull()) {
				theBoard.writeln('The board is full, so game stopped!');
				theBoard.showInputButton(false);
				theBoard.showResetButton(true);
			} else {
				theBoard.writeln('Turn for ' + theBoard.turn
						+ '. Move on which space...');
			}
		}
	},
	resetGame : function() {
		theBoard.clearData();
		theBoard.clearBoard();
		theBoard.showResetButton(false);
		theBoard.showInputButton(true);
		theBoard.writeln('Turn for ' + theBoard.turn + '. Move on which space');
	}
};

function gamestart() {
	console.log('gamestart.');

	// Get the inputButton field
	var inputText = document.getElementById("input_text");
	var inputButton = document.getElementById("input_button");
	var resetButton = document.getElementById("reset_button");

	// Execute a function when the user releases a key on the keyboard
	inputText.addEventListener("keyup", function(event) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Trigger the button element with a click
			inputButton.click();
		}
	});

	resetButton.addEventListener("click", function(event) {
		theController.resetGame();
	});

	theBoard.printBoard();
	theBoard.writeln('Turn for ' + theBoard.turn + '. Move on which space');
}

function test() {
	console.log(theBoard)
	for ( var key in theBoard.boardData) {
		theBoard.writeln(key + ':' + theBoard.boardData[key])
	}
}

function makeAAlmostWin() {
	theBoard.boardData = {
		'top-L' : 'O',
		'top-M' : 'X',
		'top-R' : 'X',
		'mid-L' : '=',
		'mid-M' : 'O',
		'mid-R' : '=',
		'low-L' : '=',
		'low-M' : '=',
		'low-R' : '='
	};
	theBoard.turn = 'O';
	theBoard.printBoard();
}

function makeAAlmostFull() {
	theBoard.boardData = {
		'top-L' : 'O',
		'top-M' : 'X',
		'top-R' : 'X',
		'mid-L' : 'X',
		'mid-M' : 'O',
		'mid-R' : 'O',
		'low-L' : 'O',
		'low-M' : '=',
		'low-R' : 'X'
	};
	theBoard.turn = 'O';
	theBoard.printBoard();
}

// test();
window.addEventListener("load", gamestart);