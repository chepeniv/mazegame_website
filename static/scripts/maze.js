#!/usr/bin/node
/* global $ */

// if encoded with prime numbers use a dictionary
// ref: 00 02 03 05 07 11 13 17 19 23 29 31 37 41 43

const mazeSize = 16;
const lastRow = mazeSize - 1;
const lastColumn = lastRow;

const wallEncodings = [
  'no-wall',
  'left-wall',
  'right-wall',
  'left-wall right-wall',

  'top-wall',
  'left-wall top-wall',
  'right-wall top-wall',
  'left-wall right-wall top-wall',

  'bottom-wall',
  'left-wall bottom-wall',
  'right-wall bottom-wall',
  'left-wall right-wall bottom-wall',

  'top-wall bottom-wall',
  'left-wall top-wall bottom-wall',
  'right-wall top-wall bottom-wall '
];

// used to confine and center entry and exits
function padNum (size) {
  const center = size - 6;
  return Math.floor((Math.random() * center) + 3);
}

function buildRow (size, y) {
  $('.maze').append(`<tr class="row ${y}"></tr>`);
  const lastRow = $('tr').last();

  for (let x = 0; x < size; x++) {
    lastRow.append(`<td class="block ${x}"></td>`);
    const lastBlock = lastRow.children().last();
    if (y === 0) {
      lastBlock.addClass('top-wall');
    }
    if (y === size - 1) {
      lastBlock.addClass('bottom-wall');
    }
    if (x === 0) {
      lastBlock.addClass('left-wall');
    }
    if (x === size - 1) {
      lastBlock.addClass('right-wall');
    }
  }
}

function setEntry (size) {
  const entry = padNum(size);
  const initPos = `.${entry} .0`;
  const initBlock = $(initPos);

  const isTaken = (
    initBlock.hasClass('encounter') ||
    initBlock.hasClass('item-block')
  );

  if (!isTaken) {
    initBlock.addClass('player-pos');
  } else {
    setEntry(size);
  }
}

function setExits (size) {
  const topExit = padNum(size);
  const rightExit = padNum(size);
  const bottomExit = padNum(size);

  const topEdge = `.0 .${topExit}`;
  const rightEdge = `.${rightExit} .${lastColumn}`;
  const bottomEdge = `.${lastRow} .${bottomExit}`;

  const randEntry = Math.floor(Math.random() * 3);

  if (randEntry === 0) {
    $(topEdge).addClass('exit-top');
  } else if (randEntry === 1) {
    $(rightEdge).addClass('exit-right');
  } else {
    $(bottomEdge).addClass('exit-bottom');
  }
}

function buildMazeGrid (size) {
  for (let i = 0; i < size; i++) {
    buildRow(size, i);
  }
  setEntry(size);
  setExits(size);
}

function drawMaze (layout) {
  const height = layout.length;
  const width = Math.floor(height / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const shift = y % 2;
      const row = y;
      const column = (x * 2) + shift;

      const code = layout[y][x];
      const walls = wallEncodings[code];

      const coordinates = `.${row} .${column}`;
      $(coordinates).addClass(walls);
    }
  }
}

$(function () {
  buildMazeGrid(mazeSize);

  $.get('static/data/maze_data.json', function (data) {
    drawMaze(data);
  }, 'json');
});
