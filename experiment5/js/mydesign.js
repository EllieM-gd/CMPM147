/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

let types = ["rect", "ellipse", "triangle"];

function getInspirations() {
  return [
    {
      name: "San Francisco", 
      assetUrl: "img/SF.jpg",
      credit: "San Francisco, HD Wide Wallpaper, 2013"
    },
    {
      name: "JD Vance and the Pope", 
      assetUrl: "img/jd-vance-meets-pope-francis.jpg",
      credit: "Vice President JD Vance, left, meets Pope Francis in the Vatican , White House, 2025"
    },
    {
      name: "Cat", 
      assetUrl: "img/cat.jpg",
      credit: "Rare Cat Color, Reddit/u/Phatbass58, 2024"
    },
    {
      name: "Sloth Selfie", 
      assetUrl: "img/selfie-sloth.jpg",
      credit: "Sloth takes a selfie, Reddit/u/Feodorp Costa Rica, 2017"
    },
  ];
}

function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let tempCanvasWidth = inspiration.image.width
  //clamp the tempCanvasWidth to 1000 pixels
  if (tempCanvasWidth > 600) {
    tempCanvasWidth = 600;
  }
  let canvasHeight = tempCanvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  console.log(canvasWidth, canvasHeight);
  console.log(tempCanvasWidth, inspiration.image.height);
  resizeCanvas(tempCanvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    fg: []
  }

  for(let y = 0; y < canvasHeight; y += 10) {
    for(let x = 0; x < tempCanvasWidth; x += 10) {
      let color = inspiration.image.get(x, y);

      let type = random(types);

      design.fg.push({
        x: x,
        y: y,
        w: random(width / 7),
        h: random(height / 6),
        type: type,
        fillR: color[0] + random(-5, 5),
        fillG: color[1] + random(-5, 5),
        fillB: color[2] + random(-5, 5)
      });
    }
  }

  return design;
}

function renderDesign(design, inspiration) {
  
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(box.fillR, box.fillG, box.fillB, 128);
    if (box.type == "rect") rect(box.x, box.y, box.w, box.h);
    else if (box.type == "eclipse") ellipse(box.x, box.y, box.w, box.h);
    else triangle(box.x-box.w/2,box.y-box.h+box.h/4, box.x+box.w, box.y-box.h+box.h/4, box.x, box.y-box.h/2);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.x = mut(box.x, box.x-25, box.x+25, rate);
    box.y = mut(box.y, box.y-25, box.y+25, rate);
    box.w = mut(box.w, box.w - 70, box.w + 50, rate);
    box.h = mut(box.h, box.h - 50, box.h + 50, rate);
    let color = inspiration.image.get(box.x, box.y);
    box.fillR = color[0] + random(-10, 10),
    box.fillG = color[1] + random(-10, 10),
    box.fillB = color[2] + random(-10, 10);
    box.type = random(types);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}