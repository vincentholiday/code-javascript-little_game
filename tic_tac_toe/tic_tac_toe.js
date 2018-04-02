function log(str) {
	console.log(str);
}
var DEBUG = false;
function debug(str) {
	if (DEBUG)
		console.log(str);
}
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
				debug('click:' + this.id);
				theController.clickMove(this.id);
			});
		}

		// add button events
		var resetButton = document.getElementById("reset_button");
		var selectObutton = document.getElementById("select_o_button");
		var selectXbutton = document.getElementById("select_x_button");
		var selectNormalRadio = document.getElementById("select_normal_radio");
		var selectSmartRadio = document.getElementById("select_smart_radio");

		selectObutton.addEventListener("click", function(event) {
			theController.selcetSideO();
		});
		selectXbutton.addEventListener("click", function(event) {
			theController.selcetSideX();
		});
		resetButton.addEventListener("click", function(event) {
			theController.resetGame();
		});
		selectNormalRadio.addEventListener("click", function(event) {
			theController.selectNormalAI();
		});
		selectSmartRadio.addEventListener("click", function(event) {
			theController.selectSmartAI();
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
		this.writeln('Turn for ' + this.turn + '.');
	},
	clearData : function() {
		for ( var key in this.boardData) {
			this.boardData[key] = '=';
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
	getPrettyBoardData : function(boardData) {
		var str = '';
		str += boardData['top-L'] + '|' + boardData['top-M'] + '|'
				+ boardData['top-R'];
		str += '\n' + boardData['mid-L'] + '|' + boardData['mid-M'] + '|'
				+ boardData['mid-R'];
		str += '\n' + boardData['low-L'] + '|' + boardData['low-M'] + '|'
				+ boardData['low-R'];
		return str;
	},
	/**
	 * 
	 * @param symbol
	 * @returns if this turn won by the symbol
	 */
	isWon : function(boardData, turn) {
		var s = turn;
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
	isAnotherBoardFull : function(boardData) {
		for ( var key in boardData) {
			if (boardData[key] == '=')
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
	levels : {
		'normal' : 1,
		'smart' : 2
	},
	level : 1,
	minmaxAlgoCount : 0,
	/**
	 * return a best move position
	 */
	queryAIBestMove : function(turn, boardData) {
		switch (this.level) {
		case this.levels.normal:
			return this.queryNormalAIBestMove(turn, boardData);
		case this.levels.smart:
			return this.querySmartAIBestMove(turn, boardData);
		}
	},
	/**
	 * return a best move position
	 */
	queryNormalAIBestMove : function(turn, boardData) {
		if (Object.assign)
			boardData = Object.assign({}, boardData); // real copy
		else
			boardData = JSON.parse(JSON.stringify(boardData));

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

		// choose the center
		if (boardData['mid-M'] == theBoard.space) {
			return 'mid-M';
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
	 * Give the next step into this function to ask the score.
	 * 
	 * @param player
	 *            the turn of the current player
	 * @param turn
	 *            next turn
	 * @param move
	 *            next move
	 * @param boardData
	 *            it would be copied
	 * @return score
	 */
	minmaxAlgo : function(player, turn, move, boardData) {
		this.minmaxAlgoCount++;
		// 1. copy the situation and move a stey by an assuming step.
		if (Object.assign)
			boardData = Object.assign({}, boardData); // real copy
		else
			boardData = JSON.parse(JSON.stringify(boardData));
		boardData[move] = turn;

		var score = 0;
		// 2. if the result has shown then return the score.
		score = this.score(player, boardData);
		if (score != 0) {
			return score;
		}

		// 3. if the board is full then return 0 that means it's draw.
		if (theBoard.isAnotherBoardFull(boardData)) {
			return score;
		}

		turn = theBoard.getOppositeTurn(turn);
		var moveScore = {};
		// 4. create a map of move-score, and call minmax algo for the next
		// turn. In oreder to fetch each score of the available move from the
		// next turn.
		for ( var key in boardData) {
			if (boardData[key] == theBoard.space) {
				var thisScore = this.minmaxAlgo(player, turn, key, boardData);
				moveScore[key] = thisScore;
				if (DEBUG)
					debug('minmaxAlgo: \nplayer: ' + player + ', turn: ' + turn
							+ ', move: ' + key + ', score: ' + thisScore + '\n'
							+ theBoard.getPrettyBoardData(boardData));
			}
		}
		// 5. if this turn belongs to the player then return the maximum
		// score within the map.
		if (player == turn) {
			var max = null;
			for ( var key in moveScore) {
				if (max == null || moveScore[key] > max) {
					max = moveScore[key];
				}
			}
			score = max;
		}

		// 6. if this turn belongs to the opponent then return the minimum
		// score within the map.
		if (player != turn) {
			var min = null;
			for ( var key in moveScore) {
				if (min == null || moveScore[key] < min) {
					min = moveScore[key];
				}
			}
			score = min;
		}
		return score
	},
	score : function(player, boardData) {
		// rules:
		// 1. if player won then return 10.
		// 2. if opponent won then return -10.
		// 3. if draw then return 0.
		if (theBoard.isWon(boardData, player)) {
			return 10;
		} else if (theBoard.isWon(boardData, theBoard.getOppositeTurn(player))) {
			return -10;
		} else {
			return 0;
		}
	},
	/**
	 * return a best move position for this player
	 */
	querySmartAIBestMove : function(playerTurn, boardData) {
		debug('querySmartAIBestMove: ' + playerTurn + '\n'
				+ theBoard.getPrettyBoardData(boardData));
		var startTime = Date.now();

		// if the computer takes the first turn then just choose the corner for
		// saving time
		var corners = [ 'top-L', 'top-R', 'low-L', 'low-R' ];
		var corLength = corners.length;
		var availCorArray = [];
		for (var i = 0; i < corLength; i++) {
			if (boardData[corners[i]] == theBoard.space) {
				availCorArray.push(corners[i]);
			}
		}
		if (availCorArray.length == 4) {
			var ranCorInt = Math.floor(Math.random() * availCorArray.length);
			var bestMove = availCorArray[ranCorInt];
			var cost = Date.now() - startTime;
			log('turn: ' + playerTurn + ', bestMove: ' + bestMove
					+ ', cost in millisec: ' + cost);
			return bestMove;
		}

		// main code start
		var max = null;
		var bestMove = null;
		for ( var move in boardData) {
			if (boardData[move] == theBoard.space) {
				var score = this.minmaxAlgo(playerTurn, playerTurn, move,
						boardData);
				if (DEBUG)
					debug('minmaxAlgo: \nplayer: ' + playerTurn + ', turn: '
							+ playerTurn + ', move: ' + key + ', score: '
							+ score + '\n'
							+ theBoard.getPrettyBoardData(boardData));
				if (max == null || score > max) {
					max = score;
					bestMove = move;
				}
			}
		}

		// main code end
		var cost = Date.now() - startTime;
		log('turn: ' + playerTurn + ', bestMove: ' + bestMove
				+ ', minmaxAlgoCount: ' + this.minmaxAlgoCount + ', score: '
				+ max + ', cost in millisec: ' + cost);
		this.minmaxAlgoCount = 0;
		// 1.239 sec if DEBUG == false
		// turn: O, bestMove: top-L, minmaxAlgoCount: 549945, score: 0, cost in
		// millisec: 177179
		return bestMove;
	}
};

var theController = {
	playerTurn : '-',// O, X, -
	isPlayersTurn : function() {
		return this.playerTurn == theBoard.turn;
	},
	gameStart : function() {
		theBoard.init();
		this.selectNormalAI();
		log('gameStart.');

	},
	gameStop : function() {
		this.playerTurn = "-";// No one's turn
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
		log('move to ' + movePos + ' by ' + theBoard.turn);
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

			// expect the next turn will see the end
			theBoard.turn = theBoard.getOppositeTurn(theBoard.turn);
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
				theBoard.writeTurn();
				if (theBoard.turn != this.playerTurn) {
					// ready for the player

					var bestMove = tttAI.queryAIBestMove(theBoard.turn,
							theBoard.boardData);
					this.move(bestMove);

				}
			}
		}
	},
	resetGame : function() {
		theBoard.clearData();
		theBoard.turn = 'O';
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
		var bestMove = tttAI.queryAIBestMove(theBoard.turn, theBoard.boardData);
		this.move(bestMove);
	},
	selectNormalAI : function() {
		tttAI.level = tttAI.levels.normal;
	},
	selectSmartAI : function() {
		tttAI.level = tttAI.levels.smart;
	}
};

window.addEventListener("load", function(event) {
	event.preventDefault();
	theController.gameStart();
});

/** Test Area * */
function test() {
	log(theBoard)
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
	log('expect: ' + 'low-R');
	log('best move: ' + bestMove);
	log('low-R' == bestMove ? "past 'win by one step' "
			: "not past 'win by one step' ");
	makeAAlmostLost();
	bestMove = tttAI.queryNormalAIBestMove(theBoard.turn, theBoard.boardData);
	log('expect: ' + 'low-R');
	log('best move: ' + bestMove);
	log('low-R' == bestMove ? "past 'stop win by one step' "
			: "not past 'stop win by one step' ");
	makeNoOneIsGoingToWin();
	bestMove = tttAI.queryNormalAIBestMove(theBoard.turn, theBoard.boardData);
	log('random step: ' + bestMove);

	theBoard.writeTurn();
}

function materialForTestPassByRef(boardData) {
	boardData['mid-M'] = '=';
}

function testPassByRef() {
	var origin = theBoard.boardData['mid-M'];
	theBoard.boardData['mid-M'] = 'O';

	log(theBoard.boardData);
	materialForTestPassByRef(theBoard.boardData);
	log(theBoard.boardData);

	if (theBoard.boardData['mid-M'] == '=') {
		log('the machanism is to pass a object into a function by ref');
	}
	// assert it is '='
	theBoard.boardData['mid-M'] = origin;
}

function testCopyObj() {
	if (Object.assign)
		boardData = Object.assign({}, theBoard.boardData); // real copy
	else
		boardData = JSON.parse(JSON.stringify(theBoard.boardData));
	theBoard.clearData();
	theBoard.boardData['mid-M'] = 'O';

	log(JSON.stringify(boardData2));
	log('are the two data obj equal: '
			+ (JSON.stringify(boardData2) === JSON
					.stringify(theBoard.boardData)));
	// recovery
	theBoard.boardData = boardData2;
}

function testScore() {
	var score = tttAI.score(theBoard.turn, theBoard.boardData);
	log('score: ' + score);
}

function testQuerySmartAIBestMove() {
	var bestMove = tttAI
			.querySmartAIBestMove(theBoard.turn, theBoard.boardData);
	log('bestMove: ' + bestMove);
}

function testGetPrettyBoardData() {
	var str = theBoard.getPrettyBoardData(theBoard.boardData);
	log(str);
}