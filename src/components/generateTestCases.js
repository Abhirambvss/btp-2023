
import React from 'react'
import { useLocation } from 'react-router-dom';


const TestCases = () => {
	const location = useLocation();
	const boolExpression = location.state.data1;
	const effect = location.state.data2;

	function generateTruthTable(expression) {
		// Extracting unique variables from the expression
		const variables = expression.match(/[A-Za-z0-9]+/g);
		const uniqueVariables = [...new Set(variables)];

		// Generating all possible combinations of true/false values for the variables
		const combinations = generateCombinations(uniqueVariables.length);

		// Evaluating the expression for each combination
		const truthTable = combinations.map((combination) => {
			const variablesMap = createVariablesMap(uniqueVariables, combination);
			const result = evaluateExpression(expression, variablesMap);
			return [...combination, result];
		});

		// Returning the truth table as an array of arrays
		return truthTable;
	}

	function generateCombinations(length) {
		const combinations = [];
		const totalCombinations = Math.pow(2, length);

		for (let i = 0; i < totalCombinations; i++) {
			const binary = i.toString(2).padStart(length, '0');
			const combination = binary.split('').map((digit) => digit === '1');
			combinations.push(combination);
		}

		return combinations;
	}

	function createVariablesMap(variables, combination) {
		const variablesMap = {};

		for (let i = 0; i < variables.length; i++) {
			variablesMap[variables[i]] = combination[i];
		}

		return variablesMap;
	}

	function evaluateExpression(expression, variablesMap) {
		// Replace variable names with their corresponding values in the expression
		const replacedExpression = expression.replace(/[A-Za-z0-9]+/g, (match) => {
			return variablesMap[match] ? 'true' : 'false';
		});

		// Evaluate the modified expression using JavaScript's eval function
		return eval(replacedExpression);
	}
	var truthTable = [];


	truthTable.push(generateTruthTable(boolExpression.find((e) => e.effect === effect).boolExpression))
	console.log(truthTable);


	return (
		< div >
			{
				truthTable.map((item, index) => (

					<div>
						{index}
					</div>
				))
			}

			{
				truthTable[0].map((item, index) => {
					return (
						item.map((it, ind) => {
							return (<div key={ind}>{it}</div>)
						})
					)
				})
			}
		</div >

	)
}

export default TestCases;