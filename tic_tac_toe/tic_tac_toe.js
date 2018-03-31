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
	boardTds : {},
	init : function() {
		// ad td events
		for (key in this.boardData) {
			var td = document.getElementById(key);
			this.boardTds[key] = td;
			td.addEventListener("click", function(event) {
				event.preventDefault();
				console.log('click:' + this.id);
				theController.clickMove(this.id);
			});
		}

		// add button events
		var resetButton = document.getElementById("reset_button");
		var selectObutton = document.getElementById("select_o_button");
		var selectXbutton = document.getElementById("select_x_button");
		selectObutton.addEventListener("click", function(event) {
			theController.selcetSideO();
		});
		selectXbutton.addEventListener("click", function(event) {
			theController.selcetSideX();
		});
		resetButton.addEventListener("click", function(event) {
			theController.resetGame();
		});

		theBoard.printBoard();
		theBoard.writeTurn();
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
	writeTurn : function() {
		this.writeln('Turn for ' + this.turn + '. Move on which space');
	},
	clearData : function() {
		for ( var key in this.boardData) {
			this.boardData[key] = '=';
			this.turn = 'O';
		}
	},
	createBoardStr : function() {
		var tableHead = "<table>";
		var row1 = "<tr><td id='top-L'>" + this.boardData['top-L']
				+ "</td><td id='top-M'>" + this.boardData['top-M']
				+ "</td><td id='top-R'>" + this.boardData['top-R']
				+ "</td></tr>";
		var row2 = "<tr><td id='mid-L'>" + this.boardData['mid-L']
				+ "</td><td id='mid-M'>" + this.boardData['mid-M']
				+ "</td><td id='mid-R'>" + this.boardData['mid-R']
				+ "</td></tr>";
		var row3 = "<tr><td id='low-L'>" + this.boardData['low-L']
				+ "</td><td id='low-M'>" + this.boardData['low-M']
				+ "</td><td id='low-R'>" + this.boardData['low-R']
				+ "</td></tr>";
		var tableTail = "</table>";
		var positionStr = "Position: low-L, low-M, low-R, mid-L, mid-M, mid-R, top-L, top-M, top-R";
		var str = tableHead + row1 + row2 + row3 + tableTail + "<br/>"
				+ positionStr;
	},
	printBoard : function() {
		for (key in this.boardData) {
			this.boardTds[key].innerHTML = this.boardData[key];
		}

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
		// choose the center
		if (boardData['mid-M'] == theBoard.space) {
			return 'mid-M';
		}

		// choose the corner
		var corners = [ 'top-L', 'top-R', 'low-L', 'low-R' ];
		var corLength = corners.length;
		var availCorArray = [];
		for (var i = 0; i < corLength; i++) {
			if (boardData[corners[i]] == theBoard.space) {
				availCorArray.push(corners[i]);
			}
		}
		if (availCorArray.length > 0) {
			var ranCorInt = Math.floor(Math.random() * availCorArray.length);
			return availCorArray[ranCorInt];
		}

		// random index of the rest postions
		var keyArray = [];
		for ( var key in boardData) {
			if (boardData[key] == theBoard.space) {
				keyArray.push(key);
			}
		}
		var freeSpaceLen = keyArray.length;
		var ranInt = Math.floor(Math.random() * freeSpaceLen);
		return keyArray[ranInt];
	},
	/**
	 * return a best move position
	 */
	querySmartAIBestMove : function(turn, boardData) {
		// TODO
	}
};

var theController = {
	playerTurn : '-',// O, X, -
	isPlayersTurn : function() {
		return this.playerTurn == theBoard.turn;
	},
	gameStop : function() {
		this.playerTurn = "-";
		theBoard.showResetButton(true);
	},
	/**
	 * move by the user
	 */
	clickMove : function(movePos) {
		if (theBoard.isValidInput(movePos) && this.isPlayersTurn()) {
			this.move(movePos);
		}
	},
	/**
	 * move and after move
	 */
	move : function(movePos) {
		movePos = movePos.trim();
		theBoard.boardData[movePos] = theBoard.turn; // move one step
		console.log('move to ' + movePos + ' by ' + theBoard.turn);
		theBoard.printBoard();
		if (theBoard.isWon(theBoard.boardData, theBoard.turn)) {
			// won
			if (this.isPlayersTurn()) {
				theBoard.writeln('<b style="color:blue">The winner is '
						+ theBoard.turn + '! Congratulation!</b>');
			} else {
				theBoard.writeln('<b style="color:red">The winner is '
						+ theBoard.turn + '! Too bad!</b>');
			}

			this.gameStop();
		} else {
			// no winner
			// change turn
			theBoard.turn = theBoard.getOppositeTurn(theBoard.turn);

			if (theBoard.isBoardFull()) {
				// the board is full
				theBoard.writeln('The board is full, so game stopped!');
				this.gameStop();
			} else {
				// ready for the next one
				theBoard.writeTurn();
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
		theBoard.printBoard();
		theBoard.showResetButton(false);
		theBoard.showSelectSideButton(true);
		theBoard.writeTurn();
	},
	selcetSideO : function() {
		theBoard.showResetButton(false);
		theBoard.showSelectSideButton(false);
		this.playerTurn = 'O';
		theBoard.writeTurn();
	},
	selcetSideX : function() {
		theBoard.showResetButton(false);
		theBoard.showSelectSideButton(false);
		this.playerTurn = 'X';
		theBoard.writeTurn();
		var bestMove = tttAI.queryNormalAIBestMove(theBoard.turn,
				theBoard.boardData);
		this.move(bestMove);
	}
};

function gameStart() {
	theBoard.init();
	console.log('gameStart.');

}

window.addEventListener("load", gameStart);

/** Test Area * */
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
	theBoard.writeTurn();
	theController.playerTurn = 'O';
}

function makeAAlmostLost() {
	theBoard.showResetButton(false);
	theBoard.showSelectSideButton(false);
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
	theBoard.writeTurn();
	theController.playerTurn = 'X';
}

function makeNoOneIsGoingToWin() {
	theBoard.showResetButton(false);
	theBoard.showSelectSideButton(false);
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
	theBoard.writeTurn();
	theController.playerTurn = 'O';
}

function makeAAlmostFull() {
	theBoard.showResetButton(false);
	theBoard.showSelectSideButton(false);
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
	theBoard.writeTurn();
	theController.playerTurn = 'O';
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

	theBoard.writeTurn();
}
