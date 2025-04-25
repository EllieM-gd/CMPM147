//Bunny class generated using ChatGPT
class Bunny {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.size = 8;

        this.direction = createVector(0, 0);
        this.timer = 0;
        this.waitTime = 60; // frames to wait (1 second if 60 FPS)
    }

    move() {
        let distToMouse = dist(this.x + this.size / 2, this.y + this.size / 2, mouseX, mouseY);
    
        if (distToMouse < 25) {
            this.fleeFromMouse();
        }
    
        if (this.timer > 0) {
            this.timer--;
            return;
        }
    
        if (this.direction.mag() === 0 || this.hitBoxCollision(this.x + this.direction.x * 16, this.y + this.direction.y * 16)) {
            this.pickNewDirection();
            this.timer = this.waitTime;
            return;
        }
    
        let nextX = this.x + this.direction.x * this.speed;
        let nextY = this.y + this.direction.y * this.speed;
    
        if (!this.hitBoxCollision(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        } else {
            this.direction.set(0, 0);
            this.timer = this.waitTime;
        }
    
        // If it has moved a full tile (within 1px), stop and wait
        if (abs(this.x % 16) < 1 && abs(this.y % 16) < 1) {
            this.direction.set(0, 0);
            this.timer = this.waitTime;
        }
    }
    

    fleeFromMouse() {
        let fleeVec = createVector(this.x + this.size / 2 - mouseX, this.y + this.size / 2 - mouseY);
        fleeVec.normalize();
    
        let testX = this.x + fleeVec.x * 16;
        let testY = this.y + fleeVec.y * 16;
    
        if (!this.hitBoxCollision(testX, testY)) {
            this.direction = fleeVec;
        }
    }
    

    pickNewDirection() {
        const directions = [
            createVector(1, 0),   // Right
            createVector(-1, 0),  // Left
            createVector(0, 1),   // Down
            createVector(0, -1)   // Up
        ];

        shuffle(directions, true);

        for (let dir of directions) {
            let testX = this.x + dir.x * 16;
            let testY = this.y + dir.y * 16;
            if (!this.hitBoxCollision(testX, testY)) {
                this.direction = dir;
                return;
            }
        }

        this.direction.set(0, 0); // No valid direction found
    }

    hitBoxCollision(nextX, nextY) {
        if (
            nextX < 0 || nextX + this.size > width ||
            nextY < 0 || nextY + this.size > height
        ) {
            return true;
        }

        for (let [hbY, hbX] of owHitBoxes) {
            if (collideRectRect(hbX * 16, hbY * 16, 16, 16, nextX, nextY, this.size, this.size)) {
                return true;
            }
        }

        let col = floor(nextX / 16);
        let row = floor(nextY / 16);
        if (owGrid && owGrid[row] && owGrid[row][col] === "~") {
            return true;
        }

        return false;
    }

    draw() {
        let d = dist(this.x + this.size / 2, this.y + this.size / 2, mouseX, mouseY);
        if (d < 48) {
            fill(255, 100, 100); // scared color
        } else {
            fill(255, 200, 200); // chill color
        }
        rect(this.x, this.y, this.size, this.size);
    }
    
}



let owHitBoxes = [];
let bunnies = [];

function generateOverworldGrid(numCols, numRows) {
    bunnies = []; // Reset bunnies
    owHitBoxes = []; // Reset hitboxes
    let grid = [];
    //Fill with grass
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    generateRiverWithNoise(grid, numCols, numRows); // Generate a river

    let forestCount = floor(random(1, 5)); // Random number of forests
    for (let i = 0; i < forestCount; i++) {
        generateForestWithNoise(grid, numCols, numRows); // Generate a forest
    } 

    //Spawn Bunnies
    for (let i = 0; i < 5; i++) {
        let bunnyX = floor(random(3, numCols - 3));
        let bunnyY = floor(random(3, numRows - 3));
        if (grid[bunnyY][bunnyX] == "_") {
            bunnies.push(new Bunny(bunnyX * 16, bunnyY * 16)); // Add bunny to the array
        }
    }

    return grid
  }

function generateForestWithNoise(grid, numCols, numRows) {
    let forestX = floor(random(3, numCols - 3));
    let forestY = floor(random(3, numRows - 3));
    let forestSize = floor(random(5, 10));
    let noiseScale = 0.1;
    
    for (let i = 0; i < forestSize; i++) {
        let n = noise(forestX * noiseScale, forestY * noiseScale);
        let angle = map(n, 0, 1, 0, TWO_PI);
    
        let dx = round(cos(angle));
        let dy = round(sin(angle));
    
        // Apply thickness
        for (let t = -1; t <= 1; t++) {
            let tx = forestX + (dy === 0 ? 0 : t);
            let ty = forestY + (dx === 0 ? 0 : t);
            if (tx >= 0 && tx < numCols && ty >= 0 && ty < numRows) {
                if (grid[ty][tx] == '_') {
                    grid[ty][tx] = "F"; // F for Forest
                    owHitBoxes.push([ty,tx]); // Add hitbox for the forest
                }
            }
        }
    
        forestX += dx;
        forestY += dy;
    
        if (
            forestX < 2 || forestX >= numCols - 2 ||
            forestY < 2 || forestY >= numRows - 2 ||
            grid[forestY][forestX] === "F"
        ) {
            return;
        }
    }

}


function generateRiverWithNoise(grid, numCols, numRows) {
    let riverX = floor(random(3, numCols - 3));
    let riverY = floor(random(3, numRows - 3));
    let thickness = floor(random(1, 3));
    let riverLength = floor(random(60, 100));
    let noiseScale = 0.3;

    for (let i = 0; i < riverLength; i++) {
        let n = noise(riverX * noiseScale, riverY * noiseScale);
        let angle = map(n, 0, 1, 0, TWO_PI);

        let dx = round(cos(angle));
        let dy = round(sin(angle));

        // Apply thickness
        for (let t = -thickness; t <= thickness; t++) {
            let tx = riverX + (dy === 0 ? 0 : t);
            let ty = riverY + (dx === 0 ? 0 : t);
            if (tx >= 0 && tx < numCols && ty >= 0 && ty < numRows) {
                grid[ty][tx] = "~";
                owHitBoxes.push([ty,tx]); // Add hitbox for the river
            }
        }

        riverX += dx;
        riverY += dy;

        if (
            riverX < 2 || riverX >= numCols - 2 ||
            riverY < 2 || riverY >= numRows - 2 ||
            grid[riverY][riverX] === "~"
        ) {
            return;
        }
    }
}
  
  
function drawOverworldGrid(grid) {
    background(128);
  
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j,"_")) { //If its an underscore draw grass.
            snowBorderDisplay(i,j,grid);
        }
        else if (gridCheck(grid,i,j,"~")) {
          placeTile(i,j, floor(random(4,0)), 13)
        }
        else if (gridCheck(grid,i,j,"F")) {
          placeTile(i,j, floor(random(4,0)), 12)  
          placeTile(i,j, 20, 6)
        }
      }
    }

    for (let bunny of bunnies) {
        bunny.move();
        bunny.draw();
    }
    
  }

function snowBorderDisplay(i, j, grid) {
    let bitCode = gridCode(grid, i, j, "~");
    const [ti, tj] = lookup[bitCode];
    if (bitCode == 0) {
        placeTile(i, j, floor(random(4,0)), 12);
        return;
    }
    placeTile(i,j, floor(random(4,0)), 13)
    if (bitCode & 1) {
        placeTile(i, j, lookupSnow[1][0], lookupSnow[1][1]);
    }
    if (bitCode & 2) {
        placeTile(i, j, lookupSnow[2][0], lookupSnow[2][1]);
    }
    if (bitCode & 4) {
        placeTile(i, j, lookupSnow[4][0], lookupSnow[4][1]);
    }
    if (bitCode & 8) {
        placeTile(i, j, lookupSnow[8][0], lookupSnow[8][1]);
    }
  }


const lookupSnow = [
    /*  0: 0000 */ [0, 0],      // No Neighbors, No case.
    /*  1: 0001 */ [22, 14],    // Only north
    /*  2: 0010 */ [22, 12],    // Only south
    /*  3: 0011 */ [22, 14],    // North + South, Maybe add both 1 and 2 on top of each other
    /*  4: 0100 */ [21, 13],    // Only east
    /*  5: 0101 */ [23, 12],    // North + east
    /*  6: 0110 */ [23, 14],    // South + east
    /*  7: 0111 */ [17, 21],    // North + south + east
    /*  8: 1000 */ [23, 13],    // Only west
    /*  9: 1001 */ [21, 12],    // North + west
    /* 10: 1010 */ [21, 14],    // South + west
    /* 11: 1011 */ [15, 21],    // North + south + west
    /* 12: 1100 */ [11, 21],    // East + west
    /* 13: 1101 */ [16, 21],    // North + east + west
    /* 14: 1110 */ [16, 23],    // South + east + west
    /* 15: 1111 */ [20, 12],    // All directions 
  ];