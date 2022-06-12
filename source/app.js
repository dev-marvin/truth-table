function change() {
	var input = document.querySelector("#formule").value

	try {		
		prettyPrintTruthTable(parse(input));
	} catch (e) {		  
		if (e.description !== undefined) {
			displayCompileError(input, e);
		} else {
			throw e;
		}
	}
}

function assert(expr, what) {
	if (expr === false) throw new Error("Assertion failed: " + what);
}