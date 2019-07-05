// https://www.hackerrank.com/challenges/crossword-puzzle
// 
// The solutions is based on https://www.geeksforgeeks.org/solve-crossword-puzzle/.

'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''));

    main();
});

function readLine() {
    return inputString[currentLine++];
}

function replaceAt(str, index, char) {
    return str.slice(0, index) + char + str.slice(index + 1);
}

function checkVertical(matrix, word, row, col) {
    matrix = [...matrix];
    for (let i = 0; i < word.length; i++) {
        if (matrix[row + i][col] === '-' || matrix[row + i][col] === word[i]) {
            matrix[row + i] = replaceAt(matrix[row + i], col, word[i]);
        } else {
            return null;
        }
    }

    return matrix;
}

function checkHorizontal(matrix, word, row, col) {
    matrix = [...matrix];
    for (let i = 0; i < word.length; i++) {
        if (matrix[row][col + i] === '-' || matrix[row][col + i] === word[i]) {
            matrix[row] = replaceAt(matrix[row], col + i, word[i]);
        } else {
            return null;
        }
    }

    return matrix;
}

function findSolution(matrix, words, wordIndex = 0) {
    matrix = [...matrix];

    // console.log('Find solution', matrix, wordIndex);

    if (wordIndex < words.length) {
        const currentWord = words[wordIndex];
        const maxCountToCheck = 10 - currentWord.length;
        for (let col = 0; col < 10; col++) {
            for (let row = 0; row <= maxCountToCheck; row++) {
                // console.log('Going to check ', currentWord, ' vertically', row, col);
                const newMatrix = checkVertical(matrix, currentWord, row, col);
                if (newMatrix) {
                    const solution = findSolution(newMatrix, words, wordIndex + 1);
                    if (solution) {
                        return solution;
                    }
                }
            }
        }

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col <= maxCountToCheck; col++) {
                // console.log('Going to check ', currentWord, ' horizontally', row, col);
                const newMatrix = checkHorizontal(matrix, currentWord, row, col);
                if (newMatrix) {
                    const solution = findSolution(newMatrix, words, wordIndex + 1);
                    if (solution) {
                        return solution;
                    }
                }
            }
        }
    } else {
        console.log('Solution found');
        console.log(matrix);
        return matrix;
    }
}

// Complete the crosswordPuzzle function below.
function crosswordPuzzle(crossword, hints) {
    console.log(crossword);
    console.log(hints);
    return findSolution(crossword, hints.split(';'));
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    let crossword = [];

    for (let i = 0; i < 10; i++) {
        const crosswordItem = readLine();
        crossword.push(crosswordItem);
    }

    const words = readLine();

    const result = crosswordPuzzle(crossword, words);

    ws.write(result.join('\n') + '\n');

    ws.end();
}

