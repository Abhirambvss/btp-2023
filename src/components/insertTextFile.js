/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';

const InsertTextFile = () => {
  const edgeType = 'smoothstep';

  let fileReader;
  const position = { x: 0, y: 0 };
  const [cegNodes, setCegNodes] = useState([]);
  const [effects, setEffects] = useState([]);
  const [cegEdges, setcegEdges] = useState([]);
  const [fileContent, setFileContent] = useState([]);
  const [booleanExpression, setbooleanExpression] = useState([]);
  const [file, setFile] = useState(null);
  // const [testCases, setTestCases] = useState([]);
  var truthTable = [];

  const result = [];

  // const [booleanExpression]
  const booleanOperators = new Map();
  booleanOperators.set("AND", '&');
  booleanOperators.set("OR", '|');
  booleanOperators.set("NOT", '!');




  const handleFileRead = (e) => {
    const content = fileReader.result;
    var array = content.split('\n');
    setFileContent(array);
    console.log(array);
    var key = '1';
    var temp = [];
    var edges = [];
    var edgesId = [];
    var causes = [];
    var effects = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i].trim() === 'CAUSES:') {
        i++;
        while (i < array.length && array[i].trim() !== 'EFFECTS:') {
          // console.log(array[i], i);
          causes.push(array[i]);
          temp.push({
            id: key.toString(),
            type: 'input',
            data: { label: array[i] },
            position,
          });
          key++;
          i++;
        }
        i--;
      } else if (array[i].trim() === 'EFFECTS:') {
        i++;
        while (i < array.length && array[i].trim() !== 'INTERMEDIATES:') {
          // console.log(array[i], i);
          effects.push(array[i]);
          temp.push({
            id: key.toString(),
            type: 'output',
            data: { label: array[i] },
            position,
          });
          key++;
          i++;
        }
        i--;
      } else if (array[i].trim() === 'INTERMEDIATES:') {
        i++;
        // console.log(array[i], i);
        while (array[i].trim() !== 'RELATION:') {
          temp.push({
            id: key.toString(),
            data: { label: array[i] },
            position,
          });
          key++;
          i++;
        }
        i--;
      } else if (array[i].trim() === 'RELATION:') {
        i++;
        var label = array[i].trim();
        // console.log(label, i);
        var eds = [];
        i++;
        // console.log(array[i]);

        while (i < array.length && array[i].trim() !== 'RELATION:') {
          // console.log('hello');
          if (array[i].trim() === 'CAUSE:') {
            i++;
            eds.push(array[i]);
          } else if (array[i].trim() === 'EFFECT:') {
            i++;

            for (var j = 0; j < eds.length; j++) {
              var edId = 'e';
              var source = '',
                target = '';
              source = temp.find((e) => e.data.label === eds[j]).id;
              edId += source;
              if (temp.find((e) => e.data.label === array[i]) !== undefined) {
                target = temp.find((e) => e.data.label === array[i]).id;
                edId += target;
              } else {
                target = temp.find((e) => e.data.label.trim() === array[i]).id;
                edId += target;
              }
              // console.log(edId);
              if (edgesId.includes(edId, 0)) {
              } else {
                edgesId.push(edId);
                edges.push({
                  id: edId,
                  source: source,
                  target: target,
                  animated: true,
                  label: label,
                });
              }
            }
          }
          i++;
        }
        i--;
      }
    }
    console.log(temp, edges);
    setEffects(effects);
    setCegNodes(temp);
    setcegEdges(edges);
    // createBooleanExpression(causes, effects, edges, temp);
  };
  var cegEdge = [
    {
      id: 'e25',
      source: '2',
      target: '5',
      type: edgeType,
      animated: true,
      label: 'AND',
    },
    { id: 'e35', source: '3', target: '5', type: edgeType, animated: true },
    { id: 'e14', source: '1', target: '4', type: edgeType, animated: true },
    { id: 'e24', source: '2', target: '4', type: edgeType, animated: true },
  ];
  var cegNode = [
    {
      id: '1',
      type: 'input',
      data: {
        label: 'C,1\r',
      },
      position,
    },
    {
      id: '2',
      type: 'input',
      data: {
        label: 'C,2\r',
      },
      position,
    },
    {
      id: '3',
      type: 'input',
      data: {
        label: 'C,3\r',
      },
      position,
    },
    {
      id: '4',
      type: 'output',
      data: {
        label: 'E,1\r',
      },
      position,
    },
    {
      id: '5',
      type: 'output',
      data: {
        label: 'E,2\r',
      },
      position,
    },
  ];

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  const navigate = useNavigate();

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
  const makeBoolean = () => {
    // const result = [];
    const operatorMapping = {
      AND: '&&',
      OR: '||',
    };
    const eff = effects.map((ele) => ele.trim());
    // console.log(eff);
    for (let i = 0; i < eff.length; i++) {
      var ans = '';
      var arr = [];
      arr.push(eff[i]);
      while (arr.length > 0) {
        const ele = arr.pop();
        const pos = mapping.get(ele);
        const edgespos = [];
        const edges = [];
        cegEdges.forEach((el) => {
          if (el.target === pos) {
            arr.push(reverseMapping.get(el.source));
            edgespos.push(el.source);
            edges.push(el);
          }
        });
        // console.log(edges, i);
        if (edges.length !== 0) {
          var temp = '( ';
          //   const temp =
          //     '( ' +
          //     reverseMapping.get(edgespos[0]) +
          //     ' ' +
          //     edges[0].label +
          //     ' ' +
          //     reverseMapping.get(edgespos[1]) +
          //     ' )';
          for (let j = 0; j < edges.length - 1; j++) {
            // console.log(edges[j].label);
            if (edges[j].label === "NOT") {
              temp +=
                booleanOperators.get(edges[j].label) + ' ' + reverseMapping.get(edgespos[j]);
            }
            else {
              temp +=
                reverseMapping.get(edgespos[j]) + ' ' + booleanOperators.get(edges[j].label) + ' ';
            }
          }

          temp += reverseMapping.get(edgespos[edges.length - 1]) + ' )';

          if (ans.length === 0) {
            ans += temp;
          } else {
            // console.log('ELSE');
            ans = ans.replace(ele, temp);
          }
        }
      }

      result.push({
        "effect": eff[i],
        "boolExpression": ans
      });
      console.log(ans);

    }
    for (var i = 0; i < result.length; i++) {
      truthTable = generateTruthTable(result[i].boolExpression);

      console.log(truthTable);

    }
    console.log(result);
    setbooleanExpression(result);

  };
  const mapping = new Map();
  const reverseMapping = new Map();

  const handleClick = () => {
    if (file === null)
      alert("Please upload a file!!");
    else {
      cegNodes.forEach((ele) => {
        mapping.set(ele.data.label.trim(), ele.id);
        reverseMapping.set(ele.id, ele.data.label.trim());
      });

      makeBoolean();
      console.log(booleanExpression);
      navigate('/graph', {
        state: {
          data1: cegNodes,
          data2: cegEdges,
          data3: result,
        },
      });
    }
  };
  return (
    <>
      <div className="p-1 m-1 font-mono">Upload a text file </div>
      <div className="p-1 m-1 font-mono">
        <input
          type="file"
          accept=".txt"
          onChange={
            (e) => {
              handleFileChosen(e.target.files[0]);
              setFile(e.target.files[0]);
            }
          }
          onClick={(event) => (event.target.value = null)}
        />
      </div>
      <button type="submit" onClick={handleClick}>
        Submit
      </button>
      <div>
      </div>

      {/* {<pre className="p-1 m-1 ">
        {truthTable.map((item, index) => (
          item.map((i, ind) => {
            return (
              <div key={ind}>{i}</div>
            )
          })
        ))}
      </pre>} */}



      <pre className="p-1 m-1 ">
        {fileContent.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </pre>
    </>
  );
};

export default InsertTextFile;
