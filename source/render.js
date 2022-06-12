function prettyPrintTruthTable(parseResult) {
	var table = createTableElement();
	createTableHeader(table, parseResult);
	generateTruthTable(parseResult, outputRow(table));
	displayTable(table);
}

function createTableElement() {
	var result = document.createElement("table");
	result.className = "grid";
	return result;
}

function createTableHeader(table, parseResult) {
	var header = document.createElement("tr");
	header.className = "header";

	for (var i = 0; i < parseResult.variables.length; i++) {
		var cell = document.createElement("th");
		cell.className = "variable";
		cell.innerHTML = parseResult.variables[i];
		header.appendChild(cell);
	}
	
	var lastCell = document.createElement("th");
	lastCell.className = "expression";
	lastCell.innerHTML = parseResult.ast.toString(parseResult.variables);
	header.appendChild(lastCell);

	table.appendChild(header);
} 

function outputRow(table) {
	return function(assignment, result) {
		var row = document.createElement("tr");
		
		for (var i = 0; i < assignment.length; i++) {
			var cell = document.createElement("td");
			cell.innerHTML = Number(assignment[i]);
			row.appendChild(cell);
		}
		
		var lastCell = document.createElement("td");
		lastCell.innerHTML = Number(result);
		row.appendChild(lastCell);
		
		table.appendChild(row);
	}
}

function displayTable(table) {
	var holder = document.createElement("div");
	holder.className = "grid-holder";
	holder.appendChild(table);
	
	showObject(holder);
}

function showObject(object) {
	var target = document.querySelector('#table')

	while (target.children.length !== 0) target.removeChild(target.children[0]);

	target.appendChild(object);
}

function displayCompileError(input, error) {
	var holder = document.createElement("div");
	
	holder.appendChild(createHighlightedErrorBox(input, error));
	holder.appendChild(createDescriptionBox(error));
	
	showObject(holder);
}

function createHighlightedErrorBox(input, error) {
	var box = document.createElement("div");
	box.className = "syntax-error-holder";
	
	var prefix = document.createElement("span");
	prefix.className = "syntax-okay";
	prefix.textContent = input.substring(0, error.start);
	
	var problem = document.createElement("span");
	problem.className = "syntax-error";
	problem.textContent = input.substring(error.start, error.end);
	
	var suffix = document.createElement("span");
	suffix.className = "syntax-okay";
	suffix.textContent = input.substring(error.end);
	
	box.appendChild(prefix);
	box.appendChild(problem);
	box.appendChild(suffix);
	return box;
}

function createDescriptionBox(error) {
	var box = document.createElement("div");
	box.className = "syntax-error-explanation";
	box.textContent = error.description;
	return box;
}
