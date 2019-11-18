/*
Brianfuck syntax:
 - ">": increment data pointer to the next cell (move one to the right)
 - "<": decrement the data pointer to the previous cell (move one to the left)
 - "+": increment the value in the cell indicated by data pointer (increase by one)
 - "-": decrement the value in the cell indicated by data pointer (decrease by one)
 - ".": output the value in the cell indicated by the data pointer
 - ",": take input and store it in the cell indicated by the data pointer
 - "[": if the value in the cell indicated by the data pointer is zero, 
    then jump to command after next "]"
 - "]": if the value in the cell indicated by the data pointer is not zero, 
    then jump back to command after previous "["

*/


var tape = [0];
var tapeHead = 0;
var inputHead = 0;
var CELL_BIT_LENGTH = 8;
var input = "";
var running = false;

function moveRight() {
    tapeHead++;
    if (tapeHead > tape.length - 1) {
        tape.push(0);
    }
}

function moveLeft() {
    tapeHead--;
    if (tapeHead < 0) {
        tape.unshift(0);
        tapeHead = 0;
    }
}

function incrementCell() {
    tape[tapeHead] < (32 * CELL_BIT_LENGTH) - 1 ? tape[tapeHead]++ : tape[tapeHead] = 0;
}

function decrementCell() {
    tape[tapeHead] > 0 ? tape[tapeHead]-- : tape[tapeHead] = (32 * CELL_BIT_LENGTH) - 1;
}

function outputValue() {
    console.log(tape[tapeHead] + " : " + String.fromCharCode(tape[tapeHead]));
    document.getElementById("bfOutput").value+=String.fromCharCode(tape[tapeHead]);
}

function inputValue() {
    tape[tapeHead] = prompt("Please enter a value 0-255", "0");
}

function startLoop() {
    if (tape[tapeHead] == 0) {
        tmpHead = inputHead;
        openBracketCounter = 0;
        searching = true;
        while (searching) {
            tmpHead++;
            if (input[tmpHead] == "]") {
                if (openBracketCounter == 0) {
                    inputHead = tmpHead;
                    searching = false;
                    break;
                } else {
                    openBracketCounter--;
                }
            }
            if (input[tmpHead] == "[") {
                openBracketCounter++;
            }
        }
    }
}

function endLoop() {
    if (tape[tapeHead] != 0) {
        tmpHead = inputHead;
        closedBracketCounter = 0;
        searching = true;
        while (searching) {
            tmpHead--;
            if (input[tmpHead] == "[") {
                if (closedBracketCounter == 0) {
                    inputHead = tmpHead;
                    searching = false;
                    break;
                } else {
                    closedBracketCounter--;
                }
            }
            if (input[tmpHead] == "]") {
                closedBracketCounter++;
            }
        }
    }
}
var instructions = {};
instructions[">"] = moveRight;
instructions["<"] = moveLeft;
instructions["+"] = incrementCell;
instructions["-"] = decrementCell;
instructions["."] = outputValue;
instructions[","] = inputValue;
instructions["["] = startLoop;
instructions["]"] = endLoop;

function stepInstruction() {
    if (inputHead < input.length && instructions.hasOwnProperty(input[inputHead])) {
        instructions[input[inputHead]]();
        inputHead++;
    }
}

$('#bfInput').on("change keyup paste", function () {
    reset()
});

function toggleRun() {
    running = !running;
    while (running && inputHead < input.length) {
        stepInstruction();
    }
}

function reset() {
    running = false;
    inputHead = 0;
    tapeHead = 0;
    tape = [0];
    input = document.getElementById("bfInput").value;
    document.getElementById("bfOutput").value = "";
}

document.getElementById('run').addEventListener('click', toggleRun);
