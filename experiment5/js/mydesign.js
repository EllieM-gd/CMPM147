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
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    fg: []
  }

  for(let x = 0; x < width; x += 10) {
    for(let y = 0; y < height; y += 15) {
      let color = inspiration.image.get(x, y);
      let color2 = inspiration.image.get(x + random(width/15, width/10), y);
      let color3 = inspiration.image.get(x - random(width/15, width/10), y);
      let color4 = inspiration.image.get(x, y + random(height/15, height/10));
      let color5 = inspiration.image.get(x, y - random(height/15, height/10));
      let type = "";
      if (areColorsSimilar(color, color2, color3, 10)) {
        type = types[0];
      }
      else if (areColorsSimilar(color, color2, color3, 20)) {
        type = types[1];
      }
      else {
        type = types[2];
      }
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

  
  // for(let i = 0; i < 1000; i++) {
  //   let saveX = random(width);
  //   let saveY = random(height);
  //   //We could check the colors at different points and if they are vastly different we could use a smaller triangle
  //   let color = inspiration.image.get(saveX, saveY);
  //   let color2 = inspiration.image.get(saveX + random(width/15, width/10), saveY);
  //   let color3 = inspiration.image.get(saveX - random(width/15, width/10), saveY);
  //   let type = "";

  //   if (areColorsSimilar(color, color2, color3, 10)) {
  //     type = types[0];
  //   }
  //   else if (areColorsSimilar(color, color2, color3, 20)) {
  //     type = types[1];
  //   }
  //   else {
  //     type = types[2];
  //   }

  //   design.fg.push({x: saveX,
  //                   y: saveY,
  //                   w: random(width/8),
  //                   h: random(height/6),
  //                   type: type,
  //                   fillR: inspiration.image.get(saveX, saveY)[0] + random(-10, 10),
  //                   fillG: inspiration.image.get(saveX, saveY)[1] + random(-10, 10),
  //                   fillB: inspiration.image.get(saveX, saveY)[2] + random(-10, 10)});
  // }
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
    box.w = mut(box.w, box.w - 50, box.w + 50, rate);
    box.h = mut(box.h, box.h - 50, box.h + 50, rate);
    box.fillR = inspiration.image.get(box.x, box.y)[0] + random(-10, 10),
    box.fillG = inspiration.image.get(box.x, box.y)[1] + random(-10, 10),
    box.fillB = inspiration.image.get(box.x, box.y)[2] + random(-10, 10);
    box.type = random(types);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}


//Generated with ChatGPT
//Used to compare if two colors are similar
function areColorsSimilar(c1, c2, c3, threshold) {
  // Each c is an array: [r, g, b, a]
  function colorDistance(a, b) {
    return dist(a[0], a[1], a[2], b[0], b[1], b[2]);
  }

  let d1 = colorDistance(c1, c2);
  let d2 = colorDistance(c1, c3);
  let d3 = colorDistance(c2, c3);

  // Average or max distance check (can adjust logic)
  let averageDistance = (d1 + d2 + d3) / 3;
  return averageDistance < threshold;
}
