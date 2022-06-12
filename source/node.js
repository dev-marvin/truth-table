function trueNode() {}

trueNode.prototype.evaluate = () => true;
trueNode.prototype.toString = () => "V";

function falseNode() {}

falseNode.prototype.evaluate = () => false;
falseNode.prototype.toString = () => "F";

function negateNode(underlying) {
	this.underlying = underlying;
}

negateNode.prototype.evaluate = function(assignment) {
	return !this.underlying.evaluate(assignment);
}
negateNode.prototype.toString = function(variables) {
	return "!" + this.underlying.toString(variables);
}

function andNode(lhs, rhs, prioritization) {
	this.lhs = lhs;
	this.rhs = rhs;
	this.prioritization = prioritization;
}

andNode.prototype.evaluate = function(assignment) {
	return this.lhs.evaluate(assignment) && this.rhs.evaluate(assignment);
}
andNode.prototype.toString = function(variables) {
	let string = this.lhs.toString(variables) + " x " + this.rhs.toString(variables);
	return (this.prioritization ? "(" + string + ")" : string);
}

function orNode(lhs, rhs, prioritization) {
	this.lhs = lhs;
	this.rhs = rhs;
	this.prioritization = prioritization;
}

orNode.prototype.evaluate = function(assignment) {
	return this.lhs.evaluate(assignment) || this.rhs.evaluate(assignment);
}
orNode.prototype.toString = function(variables) {
	let string = this.lhs.toString(variables) + " + " + this.rhs.toString(variables);
	return (this.prioritization ? "(" + string + ")" : string);
}

function impliesNode(lhs, rhs, prioritization) {
	this.lhs = lhs;
	this.rhs = rhs;
	this.prioritization = prioritization;
}

impliesNode.prototype.evaluate = function(assignment) {
	return !this.lhs.evaluate(assignment) || this.rhs.evaluate(assignment);
}
impliesNode.prototype.toString = function(variables) {
	let string = this.lhs.toString(variables) + " &rarr; " + this.rhs.toString(variables);
	return (this.prioritization ? "(" + string + ")" : string);
}

function ifNode(lhs, rhs, prioritization) {
	this.lhs = lhs;
	this.rhs = rhs;
	this.prioritization = prioritization;
}

ifNode.prototype.evaluate = function(assignment) {
	return this.lhs.evaluate(assignment) === this.rhs.evaluate(assignment);
}
ifNode.prototype.toString = function(variables) {
	let string = this.lhs.toString(variables) + " &harr; " + this.rhs.toString(variables);
	return (this.prioritization ? "(" + string + ")" : string);
}

function variableNode(index) {
	this.index = index;
}

variableNode.prototype.evaluate = function(assignment) {
	return assignment[this.index];
}
variableNode.prototype.toString = function(variables) {
	return variables[this.index];
}
