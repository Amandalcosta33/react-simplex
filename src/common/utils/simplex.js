/**
 * Created by Eduardo Henrique de Souza
 * 2022-06
 */
 let simplex_method = "default|special";

 /* i: Index of variable to replace */
 let identifiers = {
     variable: "xi",
     excess: "xfi",
 }
 
 let problem = {
     fo: {
         objective: "MAX",
         uom: "R$",
         function_elements: [
             "1", "2"
         ]
     },
     productions: [
         {
             id: "1",
             description: "produto 1",
             price: 100,
             cost: 0,
             consumptions: [
                 {
                     resource_id: "1",
                     quantity: 1,
                 },
                 {
                     resource_id: "2",
                     quantity: 0,
                 },
                 {
                     resource_id: "3",
                     quantity: 2,
                 }
             ]
         },
         {
             id: "2",
             description: "produto 2",
             price: 150,
             cost: 0,
             consumptions: [
                 {
                     resource_id: "1",
                     quantity: 0,
                 },
                 {
                     resource_id: "2",
                     quantity: 1,
                 },
                 {
                     resource_id: "3",
                     quantity: 3,
                 }
             ]
         },
     ],
     resources: [
         {
             id: "1",
             description: "maquina 1",
             condition: "<=",
             quantity: 40,
             uom: "Horas"
         },
         {
             id: "2",
             description: "maquina 2",
             condition: "<=",
             quantity: 30,
             uom: "Horas"
         },
         {
             id: "3",
             description: "maquina 3",
             condition: "<=",
             quantity: 120,
             uom: "Horas"
         },
     ],
     algorithms: [],
     solutions: [],
     variables: [],
     restrictions: [],
 }
 
 /* 
  * Returns distincted resources Kinds */
 function resourcesKinds(resources) {
     return resources.map(item => item.condition)
         .filter((value, index, self) => self.indexOf(value) === index)
 }
 
 /* 
  * Returns which simplex method to use */
 function setSimplexMethod(problem) {
     let kinds = resourcesKinds(problem.resources);
     let onlyLessAndEqual = kinds.length === 1 && kinds[0] === "<=";
 
     if (problem.fo.objective === "MAX" && onlyLessAndEqual) {
         return "default";
     }
     return "special";
 }
 
 /* 
  * Returns the first algorithm as matrix table */
 function firstAlgorithm() {
     let array = [];
 
     // Set algorithm table header: Z
     array.push([]);
     array[0].push("Z");
 
     // Set first element: Z=1
     array.push([]);
     array[1].push(1);
 
     // console.log(array);
     // return;
 
     // Define method to solve problem
     simplex_method = setSimplexMethod(problem);
 
     // FO equation to 0 by setting all elements to oposite sign
     problem.fo.function_elements.forEach(item => {
 
         // Define initial variables headers
         array[0].push(`${identifiers.variable.replace("i", item)}`);
 
         let production = problem.productions.filter(value => value.id === item)[0];
         let profit = (production.price - production.cost) * -1;
         array[1].push(profit);
     });
 
     // Add excess variables
     let headers_filled = false;
     problem.resources.forEach((resource, resource_index) => {
 
         if (resource.condition !== "=") {
             array[1].push(0);
         }
 
         // Transform inequations to equations
         let row = [];
 
         // For restrictions: Z=0
         row.push(0);
 
         problem.productions.forEach((production, x) => {
             production.consumptions.forEach((consumption, y) => {
                 if (consumption.resource_id === resource.id) {
                     row.push(consumption.quantity);
                 }
             });
         });
 
         // Feed identity matrix
         problem.resources.forEach((r, i) => {
 
             // Define excess variables headers
             if (!headers_filled) {
                 array[0].push(`${identifiers.excess.replace("i", i + 1)}`);
             }
 
             if (resource_index === i) {
                 row.push(1);
             } else {
                 row.push(0);
             }
         });
 
         // Control that headers is already filled out
         headers_filled = true;
 
         row.push(resource.quantity);
         array.push(row);
     });
 
     // Set last header b as default
     array[0].push("b");
 
     // Set first algorithm default b value
     array[1].push(0);
 
     return array;
 }
 
 /* 
  * Returns the first solution and push to the problem solution array */
 function algorithmSolution(algorithm, solutionNumber = 1) {
     let columnsCount = algorithm[0].length;
     // console.log(columnsCount);
     // console.log(problem.productions.length);
 
     let solution = {
         id: solutionNumber,
         basic_variables: [
         ],
         non_basic_variables: [
         ],
         Z: algorithm[1][algorithm[0].indexOf("b")],
         result: "?"
     };
 
     // Start verifying after Z column
     for (let y = 1; y < columnsCount; y++) {
 
         let columnArray = [];
 
         // Start verifying after headers row
         for (let x = 1; x < algorithm.length; x++) {
 
             // Create new array to get ocurrences
             columnArray.push(algorithm[x][y]);
 
             // Is last row ?
             if (x === algorithm.length - 1) {
                 const occurrences = columnArray.reduce(function (acc, curr) {
                     return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
                 }, {});
 
                 let variable = {
                     id: algorithm[0][y],
                     quantity: 0,
                 }
 
                 // Check if is basic variable
                 if (occurrences[1] === 1 && occurrences[0] === columnArray.length - 1) {
 
                     // If basic set b as the variable value
                     variable.quantity = algorithm[columnArray.indexOf(1) + 1][algorithm[0].indexOf("b")]
 
                     // Push variable to solution
                     solution.basic_variables.push(variable);
                 } else {
 
                     // If non basic, only push variable to solution
                     if (variable.id !== "b") {
                         solution.non_basic_variables.push(variable);
                     }
                 }
             }
         }
     }
     // console.log(solution);
     solution.result = checkAlgorithmSolution(algorithm);
     problem.solutions.push(solution);
 
     return solution.result;
 }
 
 /* 
  * Returns type of solution: not great, ok, great */
 function checkAlgorithmSolution(algorithm) {
 
     let pending_variables = 0;
     let current_profit = algorithm[1][algorithm[0].indexOf(`"b"`)];
 
     // Start verifying after Z column up to last initial variable
     for (let y = 1; y <= problem.productions.length; y++) {
         let variable_value = algorithm[1][algorithm[0].indexOf(`${identifiers.variable.replace("i", y)}`)];
 
         // Check if value still negative
         if (variable_value < 0) {
             pending_variables++;
         }
     }
 
     let solution = pending_variables === 0 ? "great" : (current_profit > 0 ? "ok" : "not great");
     // console.log(solution);
     return solution;
 }
 
 /* 
  * Returns the index of pivot colum (minimum negative value) */
 function definePivotColumn(algorithm) {
 
     let minimumNegativeValue = 0;
     let minimumNegativeIndex = 0;
 
     // Start verifying after Z column up to last initial variable
     for (let y = 1; y <= problem.productions.length; y++) {
         let variable_value = algorithm[1][algorithm[0].indexOf(`${identifiers.variable.replace("i", y)}`)];
         // console.log(variable_value);
 
         // Assign the minimum value and index
         if (variable_value <= minimumNegativeValue) {
             minimumNegativeValue = variable_value;
             minimumNegativeIndex = y;
         }
     }
     return minimumNegativeIndex;
 }
 
 /* 
  * Returns the index of pivot row (minimum positive value of b / pivot column value at row index) */
 function definePivotRow(algorithm, pivotColumnIndex) {
 
     let minimumPositiveValue = 0;
     let minimumPositiveIndex = 0;
 
     // Start verifying after Z=1 row
     for (let x = 1; x < algorithm.length; x++) {
 
         // console.log(algorithm[x]);
         let dividend = algorithm[x][algorithm[0].indexOf("b")];
         let divisor = algorithm[x][pivotColumnIndex];
         // console.log(dividend);
         // console.log(divisor);
 
         let result = null;
 
         // Can't divide any value by 0
         if (divisor !== 0) {
             result = dividend / divisor
             // console.log(result);
             // console.log(minimumPositiveValue);
 
             // Assign the minimum value and index
             if ((result <= minimumPositiveValue || minimumPositiveValue === 0) && result > 0) {
                 // console.log("defining");
                 minimumPositiveValue = result;
                 minimumPositiveIndex = x;
             }
         } else {
             continue;
         }
     }
     // console.log(minimumPositiveValue);
     return minimumPositiveIndex;
 }
 
 /* 
  * Returns the pivot element of algorithm */
 function definePivotElement(algorithm, pivotRowIndex, pivotColumnIndex) {
     return algorithm[pivotRowIndex][pivotColumnIndex];
 }
 
 /* 
  * Returns the new pivot row */
 function defineNewPivotRow(oldPivotRow, pivotElement) {
     let newPivotRow = [];
     for (let y = 0; y < oldPivotRow.length; y++) {
         const newElement = oldPivotRow[y] / pivotElement;
         newPivotRow.push(newElement);
     }
     // console.log(newPivotRow);
     return newPivotRow;
 }
 
 /* 
  * Returns the new row */
 function defineNewRow(newPivotRow, oldRow, coeficient) {
 
     let negativeCoeficient = coeficient * -1
     let newRow = [];
 
     for (let y = 0; y < newPivotRow.length; y++) {
         const newElement = (newPivotRow[y] * negativeCoeficient) + oldRow[y];
         newRow.push(newElement);
     }
     // console.log(newRow);
     return newRow;
 }
 
 /* Main execution to start processing */
 function main() {
 
     let algorithm = firstAlgorithm();
     problem.algorithms.push({ id: 1, algorithm: algorithm });
 
     let solutionNumber = 1;
     let solution = algorithmSolution(algorithm, solutionNumber);
 
     // console.log(solution);
 
     // If solution isn't great, continue trying
     do {
 
         let pivotColumnIndex = definePivotColumn(algorithm);
         // console.log(pivotColumnIndex);
         let pivotRowIndex = definePivotRow(algorithm, pivotColumnIndex);
         // console.log(pivotRowIndex);
         let pivotElement = definePivotElement(algorithm, pivotRowIndex, pivotColumnIndex);
         let newPivotRow = defineNewPivotRow(algorithm[pivotRowIndex], pivotElement);
 
         let newAlgorithm = [];
         // Push headers to the new algorithm
         newAlgorithm.push(algorithm[0]);
 
         // Loop through all rows
         for (let x = 1; x < algorithm.length; x++) {
 
             // Except the pivot row
             if (x !== pivotRowIndex) {
                 let newRow = defineNewRow(newPivotRow, algorithm[x], algorithm[x][pivotColumnIndex]);
                 newAlgorithm.push(newRow);
             } else {
                 newAlgorithm.push(newPivotRow);
             }
         }
 
         // Set the current algorithm
         algorithm = newAlgorithm;
         // console.log(algorithm);
 
         // Get the new algorithm solution
         solutionNumber++;
         solution = algorithmSolution(newAlgorithm, solutionNumber);
         problem.algorithms.push({ id: solutionNumber, algorithm: algorithm });
 
     } while (solution !== "great");
     const result = {
         algorithms: problem.algorithms,
         solutions: problem.solutions
     };
     // console.log(result);
     return result;
 }
 
 main();
 