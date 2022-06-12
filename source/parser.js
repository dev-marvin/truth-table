function parse(input) {
	var scanResult = scan(input);
	var tokens = scanResult.tokens;

	var operators = [];
	var operands = [];

	var needOperand = true;

	for (var i in tokens) {
		var currToken = tokens[i];

		if (needOperand) {
			if (isOperand(currToken)) {
				addOperand(wrapOperand(currToken), operands, operators);
				needOperand = false;
			}

			else if (currToken.type === "(" || currToken.type === "~") operators.push(currToken);

			else if (currToken.type === kScannerConstants.EOF) {
				if (operators.length === 0) parseError('', 0, 0); // for clear the table

				if (topOf(operators).type === '(') parseError('This opening parenthesis has no corresponding closing parenthesis.', topOf(operators).start, topOf(operators).end);
				parseError('This operator is without an operand.', topOf(operators).start, topOf(operators).end);
			}

			else parseError('We expected a variable, constant or open parenthesis here.', currToken.start, currToken.end);
		}

		else {
			if (isBinaryOperator(currToken) || currToken.type === kScannerConstants.EOF) {
				while (true) {
					if (operators.length === 0 || topOf(operators).type === "(" || priorityOf(topOf(operators)) <= priorityOf(currToken)) break;

					var operator = operators.pop();
					var rhs = operands.pop();
					var lhs = operands.pop();

					addOperand(createOperatorNode(lhs, operator, rhs, false), operands, operators);
				}

				operators.push(currToken);

				needOperand = true;
				
				if (currToken.type === kScannerConstants.EOF) break;
			}

			else if (currToken.type === ')') {
				while (true) {
					if (operators.length === 0) parseError('This closing parenthesis does not match any opening parenthesis.', currToken.start, currToken.end);

					var currOp = operators.pop();

					if (currOp.type === '(') break;

					if (currOp.type === "~") parseError('Nothing is negated by this operator.', currOp.start, currOp.end);

					var rhs = operands.pop();
					var lhs = operands.pop();

					addOperand(createOperatorNode(lhs, currOp, rhs, topOf(operators).type === '('), operands, operators);
				}

				var expr = operands.pop();

				addOperand(expr, operands, operators);
			}

			else parseError('We were expecting a close parenthesis or a binary connective here.', currToken.start, currToken.end);
		}
	}

	assert(operators.length !== 0, "No operators on the operator stack (logic error in parser?)");
	assert(operators.pop().type === kScannerConstants.EOF, "Stack top is not EOF (logic error in parser?)");

	if (operators.length !== 0) {
		var mismatchedOp = operators.pop();
		assert(mismatchedOp.type === '(', "Somehow missed an operator factoring in EOF (logic error in parser?)");
		parseError('No corresponding closing parenthesis for this opening parenthesis.', mismatchedOp.start, mismatchedOp.end);
	}

	return {
		ast: operands.pop(),
		variables: scanResult.variables
	};
}

function addOperand(node, operands, operators) {
	while (operators.length > 0 && topOf(operators).type === "~") {
		operators.pop();
		node = new negateNode(node);
	}

	operands.push(node);
}

function isOperand(token) {
	return token.type === "1" || token.type === "0" || token.type === "variable";
}

function wrapOperand(token) {
	if (token.type === "1") return new trueNode();
	if (token.type === "0") return new falseNode();
	if (token.type === "variable") return new variableNode(token.index);
	throw new Error(`Unreachable code: Token ${token.type} ins't an operand.`)
}

function isBinaryOperator(token) {
	return token.type === "<->" || token.type === "->" || token.type === "/\\" || token.type === "\\/";
}

function priorityOf(token) {
	if (token.type === kScannerConstants.EOF) return -1;
	if (token.type === "<->") return 0;
	if (token.type === "->") return 1;
	if (token.type === "\\/") return 2;
	if (token.type === "/\\") return 3;
	throw new Error(`Unreachable code: Should never need the priority of ${token.type}`)
}

function createOperatorNode(lhs, token, rhs, prioritization) {
	if (token.type === "<->") return new ifNode(lhs, rhs, prioritization);
	if (token.type === "->") return new impliesNode(lhs, rhs, prioritization);
	if (token.type === "\\/") return new orNode(lhs, rhs, prioritization);
	if (token.type === "/\\") return new andNode(lhs, rhs, prioritization);
	throw new Error(`Unreachable code: Should never need to create an operator node from ${token.type}`)
}

function topOf(array) {
	if (array.length === 0)
		throw new Error("Assertion failed: Can't get the top of an empty array.")

	return array[array.length - 1];
}

function parseError(why, start, end) {
	throw {
		"description": why,
		"start": start,
		"end": end
	};
}
