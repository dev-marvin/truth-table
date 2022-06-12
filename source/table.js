function generateTruthTable(parseResult, callback) {
	var assignment = [];
	
	for (var i = 0; i < parseResult.variables.length; i++) {
		assignment.push(false);
	}

	do {
		callback(assignment, parseResult.ast.evaluate(assignment));
	} while (nextAssignment(assignment));
}

function nextAssignment(assignment) {
	var flipIndex = assignment.length - 1;
	while (flipIndex >= 0 && assignment[flipIndex]) flipIndex--;

	if (flipIndex == -1) return false;

	assignment[flipIndex] = true;

	for (var i = flipIndex + 1; i < assignment.length; i++) assignment[i] = false;

	return true;
}