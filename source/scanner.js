kScannerConstants = {
	EOF: "$"
}

function scan(input) {
	validate(input);
	return numberVariables(preliminaryScan(input));
}

function preliminaryScan(input) {
	var i = 0;
	var variableSet = {};
	var tokens = [];

	input += kScannerConstants.EOF;
	while (true) {
		var curr = input.charAt(i);

		if (curr === kScannerConstants.EOF) {
			tokens.push(makeIdentityToken(curr, i));
			return {
				"tokens": tokens,
				"variableSet": variableSet
			};
		}

		else if (tryReadVariableName(input, i) !== null) {
			var variable = scanVariable(input, i, variableSet);
			tokens.push(makeVariableToken(variable, i, i + variable.length));

			i += variable.length;
		}

		else if (tryReadOperator(input, i) !== null) {
			var token = tryReadOperator(input, i);

			tokens.push(makeIdentityToken(token, i));

			i += token.length;
		}

		else if (/\s/.test(input.charAt(i))) i++;
		else scannerFail("The character " + input.charAt(i) + " shouldn't be here.", i, i + 1);
	}
}

function makeIdentityToken(str, index) {
	return {
		type: translate(str),
		start: index,
		end: index + str.length
	};
}

function makeVariableToken(varIndex, start, end) {
	return {
		type: "variable",
		index: varIndex,
		"start": start,
		"end": end
	};
}

function tryReadVariableName(input, index) {
	if (!/[A-Za-z_]/.test(input.charAt(index))) return null;

	var result = "";
	while (/[A-Za-z_0-9]/.test(input.charAt(index))) {
		result += input.charAt(index);
		index++;
	}

	return isReservedWord(result.replaceAll("E", "").toLowerCase()) ? null : result.toUpperCase();
}

function isReservedWord(token) {
	return token === "e" || token == "se" || token === "ou" || token === "and" || token === "or" || token === "not" || token === "nao" || token === "if" || token === "implies" || token === "implica" || token === "true" || token === "false" || token === "falso" || token === "verdadeiro";
}

function scanVariable(input, index, variableSet) {
	var variableName = tryReadVariableName(input, index);

	variableSet[variableName] = true;
	return variableName;
}

function tryReadOperator(input, index) {
	if (index < input.length - 14) {
		var fifteenChars = input.substring(index, index + 15).toLowerCase();
		if (fifteenChars === "\\leftrightarrow" || fifteenChars === "\\Leftrightarrow") return fifteenChars;
	}

	if (index < input.length - 10) {
		var elevenChars = input.substring(index, index + 11).toLowerCase();
		if (elevenChars === "\\rightarrow" || elevenChars === "\\Rightarrow") return elevenChars;
	}

	if (index < input.length - 11) {
		var tenChars = input.substring(index, index + 10).toLowerCase();
		if (tenChars === "verdadeiro") return tenChars;
	}

	if (index < input.length - 6) {
		var sevenChars = input.substring(index, index + 7).toLowerCase();
		if (sevenChars === "implies" || sevenChars === "implica") return sevenChars;
	}

	if (index < input.length - 5) {
		var sixChars = input.substring(index, index + 6).toLowerCase();
		if (sixChars === "\\wedge") return sixChars;
	}

	if (index < input.length - 4) {
		var fiveChars = input.substring(index, index + 5).toLowerCase();
		if (fiveChars === "false" || fiveChars === "falso" || fiveChars === "\\lnot" || fiveChars === "\\lneg" || fiveChars === "\\land") return fiveChars;
	}

	if (index < input.length - 3) {
		var fourChars = input.substring(index, index + 4).toLowerCase();
		if (fourChars === "true" || fourChars === "\\top" || fourChars === "\\bot" || fourChars === "\\lor" || fourChars === "\\vee" || fourChars === "\\neg") return fourChars;
	}

	if (index < input.length - 2) {
		var threeChars = input.substring(index, index + 3).toLowerCase();
		if (threeChars === "<->" || threeChars === "and" || threeChars === "<=>" || threeChars === "not" || threeChars === "nao" || threeChars === "\\to") return threeChars;
	}

	if (index < input.length - 1) {
		var twoChars = input.substring(index, index + 2).toLowerCase();
		if (twoChars === "/\\" || twoChars === "\\/" || twoChars === "->" || twoChars === "&&" || twoChars === "||" || twoChars === "or" || twoChars === "ou" || twoChars == "if" || twoChars === "se" || twoChars === "=>") return twoChars;
	}

	return /[()~e^+*!\u2227\u2228\u2192\u2194\u22A4\u22A5\u00AC]/.test(input.charAt(index))? input.charAt(index) : null;
}

function translate(input) {
	if (input === "&&" || input === "*" || input === "and" || input === "\u2227" || input === "\\land" || input === "\\wedge" || input === "^") return "/\\";
	if (input === "||" || input === "+" || input === "or" || input === "\u2228" || input === "\\lor" || input === "\\vee") return "\\/";
	if (input === "=>" || input === "\u2192" || input === "implies" || input === "\\to" || input === "\\rightarrow" || input === "\\Rightarrow") return "->";
	if (input === "<=>" || input === "\u2194" || input === "if" || input === "\\leftrightarrow" || input === "\\Leftrightarrow") return "<->";
	if (input === "not" || input === "!" || input === "\u00AC" || input === "\\lnot" || input === "\\neg") return "~";
	if (input === "\u22A4" || input === "true" || input === "\\top") return "1";
	if (input === "\u22A5" || input === "false" || input === "\\bot") return "0";
	return input;
}

function scannerFail(why, start, end) {
	throw {
		"description": why,
		"start": start,
		"end": end
	};
}

function validate(input) {
	let valids = /[A-Za-z_0-9\\\/<>\-~^()\s\&\|\=\,+*!\u2227\u2228\u2192\u2194\u22A4\u22A5\u00AC]/
	for (var i = 0; i < input.length; i++) {
		if (!valids.test(input.charAt(i))) scannerFail("Illegal character", i, i + 1);
	}
}

function numberVariables(preliminary) {
	var variables = [];
	for (var key in preliminary.variableSet) {
		variables.push(key);
	}

	variables.sort();

	for (var i = 0; i < variables.length; i++) {
		preliminary.variableSet[variables[i]] = i;
	}

	for (var j = 0; j < preliminary.tokens.length; j++) {
		if (preliminary.tokens[j].type === "variable") {
			preliminary.tokens[j].index = preliminary.variableSet[preliminary.tokens[j].index];
		}
	}

	return {
		tokens: preliminary.tokens,
		"variables": variables
	};
}
