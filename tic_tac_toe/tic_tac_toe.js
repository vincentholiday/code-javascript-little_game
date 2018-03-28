var ttt = {
	space : '=',
	turn : 'o',
	theBoard : null
};
ttt.theBoard = {
	'top-L' : ttt.space,
	'top-M' : ttt.space,
	'top-R' : ttt.space,
	'mid-L' : ttt.space,
	'mid-M' : ttt.space,
	'mid-R' : ttt.space,
	'low-L' : ttt.space,
	'low-M' : ttt.space,
	'low-R' : ttt.space
};

function writeln(str) {
	str += "<br/>";
	var ele = document.getElementById("tic_tac_toe");
	ele.innerHTML = str + ele.innerHTML;
}

function printTTTBoard() {
	var tableHead = "<table>";
	var row1 = "<tr><td>" + ttt.theBoard['top-L'] + "</td><td>"
			+ ttt.theBoard['top-M'] + "</td><td>" + ttt.theBoard['top-R']
			+ "</td></tr>";
	var row2 = "<tr><td>" + ttt.theBoard['mid-L'] + "</td><td>"
			+ ttt.theBoard['mid-M'] + "</td><td>" + ttt.theBoard['mid-R']
			+ "</td></tr>";
	var row3 = "<tr><td>" + ttt.theBoard['low-L'] + "</td><td>"
			+ ttt.theBoard['low-M'] + "</td><td>" + ttt.theBoard['low-R']
			+ "</td></tr>";
	var tableTail = "</table>";
	var positionStr = "position: low-L, low-M, low-R, mid-L, mid-M, mid-R, top-L, top-M, top-R";
	var str = tableHead + row1 + row2 + row3 + tableTail + "<br/>"
			+ positionStr;
	writeln(str);
}

function checkResult(symbol) {
	var s = symbol
	// 橫的
	if (ttt.theBoard['top-L'] == s && ttt.theBoard['top-M'] == s
			&& ttt.theBoard['top-R'] == s)
		return true
	if (ttt.theBoard['mid-L'] == s && ttt.theBoard['mid-M'] == s
			&& ttt.theBoard['mid-R'] == s)
		return true
	if (ttt.theBoard['low-L'] == s && ttt.theBoard['low-M'] == s
			&& ttt.theBoard['low-R'] == s)
		return true
		// 直的
	if (ttt.theBoard['top-L'] == s && ttt.theBoard['mid-L'] == s
			&& ttt.theBoard['low-L'] == s)
		return true
	if (ttt.theBoard['top-M'] == s && ttt.theBoard['mid-M'] == s
			&& ttt.theBoard['low-M'] == s)
		return true
	if (ttt.theBoard['top-R'] == s && ttt.theBoard['mid-R'] == s
			&& ttt.theBoard['low-R'] == s)
		return true
		// 斜的
	if (ttt.theBoard['top-L'] == s && ttt.theBoard['mid-M'] == s
			&& ttt.theBoard['low-R'] == s)
		return true
	if (ttt.theBoard['top-R'] == s && ttt.theBoard['mid-M'] == s
			&& ttt.theBoard['low-L'] == s)
		return true
	return false
}

function isValidInput() {
	var move = document.getElementById("input_text").value;
	if (move && move != '') {
		move = move.trim();
		if (move in ttt.theBoard)
			if (ttt.theBoard[move] == ttt.space) {
				ttt.move = move;
				return true;
			}
	}

	writeln('The move is invalid, please enter your move correctly!');
	return false;
}

function enterMove() {
	if (isValidInput()) {
		move();
	}
}

function move() {
	ttt.theBoard[ttt.move] = ttt.turn;
	console.log(ttt.theBoard);
	if (checkResult(ttt.turn)) {
		printTTTBoard();
		writeln('<b style="color:red">The winner is ' + ttt.turn + '! Congratulation!</b>');
	} else {
		if (ttt.turn == 'x')
			ttt.turn = 'o';
		else
			ttt.turn = 'x';
		printTTTBoard();
		writeln('Turn for ' + ttt.turn + '. Move on which space...');
	}
}

function gamestart() {
	printTTTBoard();
	writeln('Turn for ' + ttt.turn + '. Move on which space');
}
gamestart();
