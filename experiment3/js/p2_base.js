/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let owGrid = [];
let dungeonGrid = [];
let numRows, numCols;
let overworld = true;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  owGrid = [];
  dungeonGrid = [];
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  if (overworld) {
    if (owGrid.length === 0) owGrid = generateOverworldGrid(numCols, numRows);
      currentGrid = owGrid;
  } else {
  if (dungeonGrid.length === 0) dungeonGrid = generateDungeonGrid(numCols, numRows);
    currentGrid = dungeonGrid;
  }
    
  if (currentGrid) {
    if (overworld) {
      owGrid = stringToGrid(select("#asciiBox").value());
    } else {
      dungeonGrid = stringToGrid(select("#asciiBox").value());
    }
  }

  select("#asciiBox").value(gridToString(currentGrid));
  reparseGrid();
}

function reparseGrid() {
    currentGrid = stringToGrid(select("#asciiBox").value());
    if (overworld) {
      owGrid = currentGrid;
    } else {
      dungeonGrid = currentGrid;
    }
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select('#switchButton').mousePressed(toggleOverworld);
  select("#asciiBox").input(reparseGrid);
  rectMode(CORNER);


  reseed();
}


function draw() {
  randomSeed(seed);
  if (!overworld) drawDungeonGrid(currentGrid);
  else drawOverworldGrid(currentGrid);
}

function toggleOverworld() {
  overworld = !overworld;
  regenerateGrid();
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}