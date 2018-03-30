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
	getOppositeTurn : function(turn) {
		if (turn == 'X')
			return 'O';
		else
			return 'X';
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
	/**
	 * is the name of the position is correct
	 */
	isValidInput : function(movePos) {
		if (movePos && movePos != '') {
			movePos = movePos.trim();
			if (movePos in this.boardData)
				if (this.boardData[movePos] == this.space) { // 下的是空格
					return true;
				}
		}

		return false;
	},
	showSelectSideButton : function(bool) {
		var selectObutton = document.getElementById("select_o_button");
		var selectXbutton = document.getElementById("select_x_button");
		if (bool) {
			selectObutton.style.display = 'inline';
			selectXbutton.style.display = 'inline';
		} else {
			selectObutton.style.display = 'none';
			selectXbutton.style.display = 'none';
		}
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
	/**
	 * return a best move position
	 */
	queryNormalAIBestMove : function(turn, boardData) {
		boardData = Object.assign({}, boardData); // real copy
		// if win by one step
		for ( var key in boardData) {
			if (boardData[key] == theBoard.space) {
				boardData[key] = turn;
				if (theBoard.isWon(boardData, turn)) {
					return key;
				}
				boardData[key] = theBoard.space;
			}
		}
		// stop the opponenet from winning
		var oppTurn = theBoard.getOppositeTurn(turn);
		for ( var key in boardData) {

			if (boardData[key] == theBoard.space) {
				boardData[key] = oppTurn;
				if (theBoard.isWon(boardData, oppTurn)) {
					return key;
				}
				boardData[key] = theBoard.space;
			}
		}
		// random
		var keyArray = [];
		for ( var key in boardData) {
			if (boardData[key] == theBoard.space) {
				keyArray.push(key);
			}
		}
		var freeSpaceLen = keyArray.length;
		var ranInt = Math.floor(Math.random() * freeSpaceLen);
		return keyArray[ranInt];
	}
};

var theController = {
	playerTurn : 'O',
	/**
	 * move by the user
	 */
	enterMove : function() {
		var movePos = document.getElementById("input_text").value;

		if (theBoard.isValidInput(movePos)) { // verify input
			this.move(movePos);
		} else {
			theBoard
					.writeln('The move is invalid, please enter your move correctly!');
		}
	},
	/**
	 * move and after move
	 */
	move : function(movePos) {
		theBoard.boardData[movePos] = theBoard.turn; // 下了一步

		if (theBoard.isWon(theBoard.boardData, theBoard.turn)) {
			// won
			theBoard.printBoard();
			theBoard.writeln('<b style="color:red">The winner is '
					+ theBoard.turn + '! Congratulation!</b>');
			theBoard.showInputButton(false);
			theBoard.showResetButton(true);
		} else {
			// no winner
			// change turn
			theBoard.turn = theBoard.getOppositeTurn(theBoard.turn);
			theBoard.printBoard();
			if (theBoard.isBoardFull()) {
				theBoard.writeln('The board is full, so game stopped!');
				theBoard.showInputButton(false);
				theBoard.showResetButton(true);
			} else {
				theBoard.writeln('Turn for ' + theBoard.turn
						+ '. Move on which space...');
				if (theBoard.turn != this.playerTurn) {

					var bestMove = tttAI.queryNormalAIBestMove(theBoard.turn,
							theBoard.boardData);
					this.move(bestMove);

				}
			}
		}
	},
	resetGame : function() {
		theBoard.clearData();
		theBoard.clearBoard();
		theBoard.showResetButton(false);
		theBoard.showInputButton(false);
		theBoard.showSelectSideButton(true);
		theBoard.writeln('Turn for ' + theBoard.turn + '. Move on which space');
	},
	selcetSideO : function() {
		theBoard.showResetButton(false);
		theBoard.showInputButton(true);
		theBoard.showSelectSideButton(false);
		this.playerTurn = 'O';
		theBoard.writeln('Turn for ' + theBoard.turn + '. Move on which space');
	},
	selcetSideX : function() {
		theBoard.showResetButton(false);
		theBoard.showInputButton(true);
		theBoard.showSelectSideButton(false);
		this.playerTurn = 'X';
		theBoard.writeln('Turn for ' + theBoard.turn + '. Move on which space');
		var bestMove = tttAI.queryNormalAIBestMove(theBoard.turn,
				theBoard.boardData);
		this.move(bestMove);
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

function makeAAlmostLost() {
	theBoard.boardData = {
		'top-L' : 'O',
		'top-M' : 'X',
		'top-R' : '=',
		'mid-L' : '=',
		'mid-M' : 'O',
		'mid-R' : '=',
		'low-L' : '=',
		'low-M' : '=',
		'low-R' : '='
	};
	theBoard.turn = 'X';
	theBoard.printBoard();
}

function makeNoOneIsGoingToWin() {
	theBoard.boardData = {
		'top-L' : 'O',
		'top-M' : 'X',
		'top-R' : '=',
		'mid-L' : '=',
		'mid-M' : 'O',
		'mid-R' : '=',
		'low-L' : '=',
		'low-M' : '=',
		'low-R' : 'X'
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

function testNormalAI() {
	makeAAlmostWin();
	var bestMove = tttAI.queryNormalAIBestMove(theBoard.turn,
			theBoard.boardData);
	console.log('expect: ' + 'low-R');
	console.log('best move: ' + bestMove);
	console.log('low-R' == bestMove ? "past 'win by one step' "
			: "not past 'win by one step' ");
	makeAAlmostLost();
	bestMove = tttAI.queryNormalAIBestMove(theBoard.turn, theBoard.boardData);
	console.log('expect: ' + 'low-R');
	console.log('best move: ' + bestMove);
	console.log('low-R' == bestMove ? "past 'stop win by one step' "
			: "not past 'stop win by one step' ");
	makeNoOneIsGoingToWin();
	bestMove = tttAI.queryNormalAIBestMove(theBoard.turn, theBoard.boardData);
	console.log('random step: ' + bestMove);
}

// test();
window.addEventListener("load", gamestart);