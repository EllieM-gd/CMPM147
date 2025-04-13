/* exported setup, draw */
let seed = 0;
let canvasContainer;
let reimagineButton;
let canvas;

let sandHeight;
let sandColors = ["#CBBD93", "#FAE8B4", "#F4E695"]

let treeColors = ["#8B4513", "#80461B", "#87421F", "#804000"]

let waterHeight;

let skyColor1, skyColor2; //Save so we can reuse values

function setup() {
  canvasContainer = $("#canvas-container");
  canvas = createCanvas(400, 200);
  canvas.parent("canvas-container");
  
  reimagineButton = $("#reimagine");
  reimagineButton.click(function() {
    seed = Math.floor(Math.random() * 1000);
    drawScene();
  });
  drawScene();
}

//Plan:
//Gonna draw a ocean landscape scene
//The bottom most of the screen will be a grainy sandy texture
//There will be a small layer of ocean behind the sand
//Then there will be a sky, with a sunset gradient
//There will be palm trees on top of the sand, these must be drawn last


function drawScene() {
  //Reset Scene
  canvas.clear();
  loadPixels();
  background(0);
  //Set pixels to be updated
  drawSand();
  drawOcean();
  drawSky();
  //Set pixels to the canvas
  updatePixels();
  //Draw objects on top of pixels
  drawSunLine(); //Draw the sun line
  drawClouds(); //Draw the clouds
  drawPalmTrees(); 
}

function drawSand() {
  sandHeight = random(canvas.height - 75, canvas.height-40);
  for (let x = 0; x < width; x++) {
    for (let y = canvas.height; y > sandHeight; y--) {
      let sandColor = color(random(sandColors));
      set(x, y, sandColor);
    }
  }
}  

//Draw a thin ocean behind/above the sand
function drawOcean() {
  waterHeight = random(sandHeight - 25, sandHeight-5);
  let oceanColor = color(0, 0, random(100,255));
  for (let x = 0; x < width; x++) {
    for (let y = sandHeight; y > waterHeight; y--) {
      set(x, y, oceanColor);
    }
  }
  //draw pixel waves 
  let waveCount = int(random(((sandHeight - waterHeight) / 3), (sandHeight - waterHeight) / 2)); //Random number of waves based on the height of the ocean
  for (let i = 0; i < waveCount; i++) {
    let waveColor = color("White")  //white color for wave
    let waveWidth = random(20, 50);         //Width of the wave
    let waveHeight = random(3, (sandHeight - waterHeight) / 10); //Wave height scales with ocean size
    let waveY = random(waterHeight-2, sandHeight);
    let waveX = random(0, width); //X position of the wave

    for (let j = 0; j <= waveWidth; j++) {
      let x = waveX + j;
      let pct = j / waveWidth;
      let yOffset = sin(pct * PI) * -waveHeight; //single smooth arc
      set(x, waveY + yOffset, waveColor);
    }
  }

}

function drawSky() {
  colorMode(HSB);

  let hueBase = random([random(0, 20), random(330, 360)]); //red or pink
  let hueVariation = random(10, 30);
  let topColorHSB = color(hueBase, random(60, 100), random(80, 100));
  let bottomColorHSB = color((hueBase + hueVariation) % 360, random(60, 100), random(50, 80));

  // Convert to RGB to avoid rainbow wraparound
  colorMode(RGB);
  skyColor1 = topColorHSB;
  skyColor2 = bottomColorHSB;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < waterHeight; y++) {
      let inter = map(y, 0, waterHeight, 0, 1);
      let c = lerpColor(skyColor1, skyColor2, inter);
      set(x, y, c);
    }
  }
}


function drawPalmTrees() {
  let palmTreeCount = int(random(3, 7)); //Random number of palm trees
  for (let i = 0; i < palmTreeCount; i++) {
    let x = random(0, width);
    let y = random(height - 30, sandHeight + 40); //Random height for the palm tree
    drawPalmTree(x, y);
  }
}

function drawPalmTree(x,y) {
  //Draw the trunk
  let color = random(treeColors); //Save color for base later
  stroke(color); //Brown color for the trunk
  strokeWeight(7);
  let trunkHeight = y - random(40, 70); //Random height for the trunk
  line(x, y, x, trunkHeight); //Random height for the trunk

  //At the bottom of the trunk draw an upside down trapezoid for the base of the palm tree
  fill(color); //Brown color for the base of the palm tree
  noStroke
  let baseWidth = random(2, 5); //Random width for the base
  let baseHeight = random(1, 3); //Random height for the base
  beginShape();
  vertex(x - baseWidth * 0.5, y); //Left side of the base
  vertex(x + baseWidth * 0.5, y); //Right side of the base
  vertex(x + baseWidth, y + baseHeight); //Top of the base
  vertex(x - baseWidth, y + baseHeight); //Top of the base
  endShape(CLOSE); //Close the shape
  
  //Draw the coconuts
  fill(139, 80, 19); //Brown color for the coconuts
  noStroke();
  let coconutCount = int(random(1, 4)); //Random number of coconuts
  for (let k = 0; k < coconutCount; k++) {
    let coconutX = x + random(-7, 7); //Random position for the coconuts
    let coconutY = trunkHeight + random(5, 10); //Random height for the coconuts
    ellipse(coconutX, coconutY, random(5, 10), random(5, 10)); //Draw the coconuts
  }

  //Draw the leaves
  stroke(0, 128, 0); //Green color for the leaves
  strokeWeight(2);
  let leafCount = int(random(10, 20)); //Random number of leaves
  for (let j = 0; j < leafCount; j++) {
    let angle = map(j, 0, leafCount, -PI * 2, PI / 4); //Spread out the leaves
    if (angle < -3.5) {
      stroke(164,113,73); //Brown color for the leaves
    }
    else stroke(0, 128, 0); //Green color for the leaves
    let leafLength = random(10, 20); //Random length for each leaf
    line(x, trunkHeight, x + cos(angle) * leafLength, trunkHeight + sin(angle) * leafLength);
  }
}

function drawSunLine() {
  //Draw a thin eclipse to simulate the sun
  noStroke();
  let sunXOffset = random(-40,40);
  let sunX;
  if (sunXOffset < 0) {
    sunX = canvas.width + sunXOffset
  }
  else sunX = 0 + sunXOffset
  let sunY = random(waterHeight - 25, waterHeight - 4); //Random height for the sun
  let sunWidth = random(80, 120); //Random width for the sun
  let sunHeight = random(3, 10); //Random height for the sun
  fill(255, 204, 0, 60); //Yellow color for the sun
  ellipse(sunX, sunY+4, sunWidth * 3, sunHeight * 6);

  fill(255, 204, 0); //Yellow color for the sun
  ellipse(sunX, sunY, sunWidth, sunHeight); //Draw the sun
}

function drawClouds() {
  let cloudCount = int(random(3, 10)); //Random number of clouds
  for (let i = 0; i < cloudCount; i++) {
    let baseX = random(0, width);
    let baseY = random(10, waterHeight - 30);
    let cloudWidth = random(40, 80);
    let cloudHeight = random(20, 35);
    let puffCount = int(random(5, 8)); //number of ellipses per cloud

    for (let j = 0; j < puffCount; j++) {
      let offsetX = random(-cloudWidth / 4, cloudWidth / 4);
      let offsetY = random(-cloudHeight / 3, cloudHeight / 3);
      let puffW = random(cloudWidth / 3, cloudWidth / 2);
      let puffH = random(cloudHeight / 4, cloudHeight);

      // Gradient from sky color (top) to gray (bottom)
      let verticalFade = map(offsetY, -cloudHeight / 2, cloudHeight / 2, 0, 1);
      let topColor = lerpColor(skyColor2, color(255), 0.3); // sky tint on top
      let bottomColor = color(180); // soft grey bottom
      let puffColor = lerpColor(topColor, bottomColor, constrain(verticalFade, 0, 1));

      fill(puffColor, 0.5);
      noStroke();
      ellipse(baseX + offsetX, baseY + offsetY, puffW, puffH);
    }
  }

}