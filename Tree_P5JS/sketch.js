// AUTHOR:   Ryan Rizzo
// DATE:     November 20th, 2024
// FILE:     TreeGenerator.js
// VERSION:  1.0
// PURPOSE:  This file defines a procedural tree generator in P5.js JavaScript using recursive 
//           methods for rendering trees, boughs, and leaves with textured graphics.

const DEBUG = false;
const DISPLAY_W = 500;
const DISPLAY_H = 500;
const ART_DISPLAY_W = 500;
const ART_DISPLAY_H = 500;
const GRID_NUM_X = 10;
const GRID_NUM_Y = 10;
var BARK_TEXTURES = [];
var GRASS_TEXTURES = [];
var LEAVE_TEXTURES = [];
var generating;
var controlPanelCanvas;
var controlPanel;
var tree;
var seedLock = false;
var seed = 0;


class TreeGenerator {
  constructor(canopyWidth, canopyHeight, leaveWidth, leaveHeight, leaveFactor, 
              loweringFactor, swayFactor, stumpWidth, shrinkFactor, swellFactor,
              shiftFactor, branchFactor,twigFactor, boughDivisions, recursionDepth) {
    
    this.canopyWidth    = canopyWidth;
    this.canopyHeight   = canopyHeight;
    this.leaveWidth     = leaveWidth;
    this.leaveHeight    = leaveHeight;
    this.leaveFactor    = leaveFactor;
    this.loweringFactor = loweringFactor;
    this.swayFactor     = swayFactor;
    this.stumpWidth     = stumpWidth;
    this.shrinkFactor   = shrinkFactor;
    this.swellFactor    = swellFactor;
    this.shiftFactor    = shiftFactor;
    this.branchFactor   = branchFactor;
    this.twigFactor     = twigFactor;
    this.boughDivisions = boughDivisions;
    this.recursionDepth = recursionDepth;
  }
  
   stump(currX1, currY1, currX2, currY2, prevX1, prevY1, prevX2, prevY2, depth) {
     
      if (depth >= 12){
        return;
      }

      var longLog = (int(random(2)) == 0);
      var xOffset = 0;
      var swell = (ART_DISPLAY_W/256) * (this.swellFactor * (1 + depth));
      if (longLog) { 
        xOffset = int(random(-ART_DISPLAY_W/32 * this.shiftFactor, ART_DISPLAY_W/32 * this.shiftFactor));
      } else { 
        xOffset = int(random(-ART_DISPLAY_W/64 * this.shiftFactor, ART_DISPLAY_W/64 * this.shiftFactor)); 
      }

      var currBark = BARK_TEXTURES[int(random(8))];
      noStroke();
      
      // Debug output
      if (DEBUG) {
        console.log("\nGENERATING STUMP SEGMENT [Depth = " + depth + "/12]");
        console.log("   Vertex1: " + round(prevX1) + ", " + round(prevY1));
        console.log("   Vertex2: " + round(prevX2) + ", " + round(prevY2));
        console.log("   Vertex3: " + round(currX2 + xOffset + swell) + ", " + round(currY2));
        console.log("   Vertex4: " + round(currX1 + xOffset + swell) + ", " + round(currY1));
      }
      
      // Draw the current stump segment
      push();
      texture(currBark);
      beginShape();
      vertex(prevX1, prevY1, 0, 0, 0);
      vertex(prevX2, prevY2, 0, 1, 0);
      vertex((currX2 + xOffset + swell), currY2, 0, 1, 1);
      vertex((currX1 + xOffset - swell), currY1, 0, 0, 1);
      endShape();
      pop();
      
      // Generate the branches which grow off of the stump
      if (this.branchFactor >= 1) {
        for (let j = 0; j < min(this.branchFactor, 10); j++) {  // Cap the number of branches
          let divisions = max(1, this.boughDivisions - depth - 1);  // Avoid negative or zero divisions
          let levels = max(1, this.recursionDepth - depth - 1);     // Avoid negative or zero levels

          // Make sure bough recursion has a base case that limits depth
          this.boughs(currX1, currY1, 
                    (this.stumpWidth * this.twigFactor) / (depth + 1), 
                    (this.stumpWidth * this.twigFactor) / (depth + 1), 
                    0, divisions, levels);
          }
      } else {
        if (random(0, 1) < this.branchFactor) {
          let divisions = max(1, this.boughDivisions - depth - 1);
          let levels = max(1, this.recursionDepth - depth - 1);

          // Same base case for this condition
          this.boughs(currX1, currY1, 
                    (this.stumpWidth * this.twigFactor) / (depth + 1), 
                    (this.stumpWidth * this.twigFactor) / (depth + 1), 
                    0, divisions, levels);
          }
      }

      
      // Recursively call stump to generate the next segment of the stump
      if (longLog) {
        this.stump(currX1 + xOffset, currY1 + (ART_DISPLAY_H/16),
                   currX2 + xOffset, currY2 + (ART_DISPLAY_H/16),
                   currX1 + xOffset - swell, currY1,
                   currX2 + xOffset + swell, currY2, depth+1);
      }
      else {
        this.stump(currX1 + xOffset, currY1 + (ART_DISPLAY_H/8),
                   currX2 + xOffset, currY2 + (ART_DISPLAY_H/16),
                   currX1 + xOffset - swell, currY1,
                   currX2 + xOffset + swell, currY2, depth+1);
      }
  }
  
  boughs(x, y, xRadius, yRadius, depth, divisions, levels) {
    // Base case, return when our depth is equal to levels
    if (depth == levels) {
      return;
    }
    
    const prevAngles = [];
    texturedEllipse(x, y, (xRadius * 2) * this.shrinkFactor,
    (yRadius * 2) * this.shrinkFactor, BARK_TEXTURES[int(random(8))]);
    
    // Generate a number of branches equal to divisions, each with a different angle
    for (let i=0; i<divisions; i++) {
      
      // Generate the foundational angle for this branch, and guarentee that it is unique
      var angle1 = random(PI - (PI/4), 2*PI + (PI/4));
      var newAngleFound = false;
      while (!newAngleFound) {
        var valid = true;
        // Check if any of the previous angle are too similar to the new angle
        for (let currAngle of prevAngles) {
          if (angle1 > (currAngle - (PI/8)) && angle1 < (currAngle + (PI/8))) {
            valid = false;
          }
        }
        // If the angle we generated is unique enough, break the loop
        if (valid) {
          newAngleFound = true;
        // Otherwise, generate a new angle and try again
        } else {
          angle1 = random(PI - (PI/4), 2*PI + (PI/4));
        }
      }
      
      // Calculate the complementary angles based off the foundational angle
      var angle2 = angle1 + ((PI/32)/(depth+1));
      
      // Add the foundational angle to previous angles
      prevAngles.push(angle1);
      
      // Select a bark texture
      var curr_bark = BARK_TEXTURES[int(random(8))];
      
      // Select an offset for the radius
      var xRadiusOffset = int(random(-xRadius/16, xRadius/16));
      var yRadiusOffset = int(random(-yRadius/16, yRadius/16));
      
      // Calculate each corner's coordinate based off the angles generated
      var topLeftX   = 
          int(x + ((xRadius + xRadiusOffset) * cos(angle1)));
      var topLeftY   = 
          int(y + ((yRadius + yRadiusOffset) * sin(angle1)));
      var topRightX  = 
          int(x + ((xRadius + xRadiusOffset) * cos(angle2)));
      var topRightY  = 
          int(y + ((yRadius + yRadiusOffset) * sin(angle2)));
      var botRightX  = 
          int(x + (((xRadius + xRadiusOffset)* this.shrinkFactor) * cos(angle1 + radians(90))));
      var botRightY  = 
          int(y + (((yRadius + yRadiusOffset)* this.shrinkFactor) * sin(angle1 + radians(90))));
      var botLeftX   = 
          int(x + (((xRadius + xRadiusOffset)* this.shrinkFactor) * cos(angle1)));
      var botLeftY   = 
          int(y + (((yRadius + yRadiusOffset)* this.shrinkFactor) * sin(angle1)));
      
      // Generate leaves at the current node
      if (this.leaveFactor >= 1) for (let j=0; j<this.leaveFactor; j++) {
        this.leaves(topLeftX, topLeftY, this.leaveWidth / (2* (1 + depth)),
        this.leaveHeight / (1 + depth));
      }
      else {
        if (random(0, 1) < this.leaveFactor) {
          this.leaves(topLeftX, topLeftY, this.leaveWidth / (2* (1 + depth)),
          this.leaveHeight / (1 + depth));
        }
      }
      
      // Debug output
      if (DEBUG) {
        console.log("\nGENERATING BRANCH SEGMENT [Depth = " + depth + "/" + levels + "]");
        console.log("   Vertex1: " + round(topLeftX ) + ", " + round(topLeftY));
        console.log("   Vertex2: " + round(topRightX) + ", " + round(topRightY));
        console.log("   Vertex3: " + round(botRightX) + ", " + round(botRightY));
        console.log("   Vertex4: " + round(botLeftX ) + ", " + round(botLeftY));
      }
      
      // Draw the bough
      push();
      noStroke();
      texture(curr_bark);
      beginShape();
      vertex(topLeftX, topLeftY, 0, 0, 1);
      vertex(topRightX, topRightY, 0, 1, 1);
      vertex(botRightX, botRightY, 0, 1, 0);
      vertex(botLeftX, botLeftY, 0, 0, 0);
      endShape();
      pop();
      
      // Calcuate the center x & y coordinates for the next set of boughs
      var newCenterX = (topLeftX + topRightX) / 2;
      var newCenterY = (topLeftY + topRightY) / 2;
      
      // Recursive call
      this.boughs(newCenterX, newCenterY, xRadius/2, yRadius/2, depth + 1, divisions, levels);
    }
  }
  
  leaves(x, y, w, h) {
    push();
    // Move the origin to the (x, y) position
    translate(x, y);

    // Rotate the quad around the new origin
    rotate(radians(random(0, 360)));
    
    // Draw a textured quad with the vertices aligned to the (x, y) position
    var currLeaves = LEAVE_TEXTURES[int(random(4))]
    texture(currLeaves);
    beginShape();
    vertex(-w / 2, -h / 2, 0, 0, 1);  // Top-left corner of the quad
    vertex(w / 2, -h / 2, 0, 1, 1);   // Top-right corner of the quad
    vertex(w / 2, h / 2, 0, 1, 0);    // Bottom-right corner of the quad
    vertex(-w / 2, h / 2, 0, 0, 0);   // Bottom-left corner of the quad
    endShape(CLOSE);

    pop();
  }
  
  draw() {
    console.log("draw() [TreeGenerator]")
    randomSeed(seed);
    console.log("Seed: " + seed);
    
    // Draw the tree's stump
    var prevX1 = - (this.stumpWidth/2) + this.swayFactor;
    var prevY1 = + this.loweringFactor;
    var prevX2 = + (this.stumpWidth/2) + this.swayFactor;
    var prevY2 = + this.loweringFactor;
    var currx1 = - (this.stumpWidth/2) + this.swayFactor;
    var currY1 = - (ART_DISPLAY_H/8) + this.loweringFactor;
    var currx2 = + (this.stumpWidth/2) + this.swayFactor;
    var currY2 = - (ART_DISPLAY_H/8) + this.loweringFactor;
    console.log("   stump()");
    this.stump(prevX1, prevY1, prevX2, prevY2, currx1, currY1, currx2, currY2, 0);
    
    // Draw the boughs
    var branchX  = this.swayFactor;
    var branchY  = - (ART_DISPLAY_H/8) + this.loweringFactor;
    var xRadius  = this.canopyWidth;
    var yRadius  = this.canopyHeight;
    var depth     = 0;
    var divisions = this.boughDivisions;
    var levels    = this.recursionDepth;
    console.log("   boughs()");
    this.boughs(branchX, branchY, xRadius, yRadius, depth , divisions, levels);
  }
}

class Grid {
  constructor(numX, numY, w, h) {
    this.numX = numX;
    this.numY = numY;
    this.w = w;
    this.h = h;
  }

  draw() {
    console.log("draw() [Grid]");
    stroke(0)
    strokeWeight(1);
    
    // Draw all the horizontal lines
    for (let i = -this.h/2; i <= this.h/2; i += this.h/this.numY) {
      line(-this.w/2, i, this.w/2, i);
    }
    
    // Draw all the vertical lines
    for (let i = -this.w/2; i <= this.w/2; i += this.w/this.numX) {
      line(i, -this.h/2, i, this.h/2);
    }
  }
}

function grass(x, y, depth) {
  if (depth == GRID_NUM_X) {
    return;
  }
  
  // Calculate the next coordinates
  var nextX = x + ART_DISPLAY_W/GRID_NUM_X;
  var nextY = y + int(random(-ART_DISPLAY_W/32, ART_DISPLAY_W/32));
  while (nextY >= ART_DISPLAY_H) {nextY = y + int(random(-ART_DISPLAY_W/32, ART_DISPLAY_W/32));}
  
  // Debug output
  if (DEBUG) {
    console.log("\nGENERATING GRASS SEGMENT [Depth = " + depth + "/" + GRID_NUM_X + "]");
    console.log("   Vertex1: " + round(x) + ", " + round(y));
    console.log("   Vertex2: " + round(nextX) + ", " + round(nextY));
    console.log("   Vertex3: " + round(nextX) + ", " + round(ART_DISPLAY_H));
    console.log("   Vertex4: " + round(x) + ", " + round(ART_DISPLAY_H));
  }
  
  // Draw the current grass segment
  var currGrass = GRASS_TEXTURES[int(random(5))];
  noStroke();
  texture(currGrass);
  beginShape();
  vertex(x, y, 0, 0, 0);
  vertex(nextX, nextY, 0, 1, 0);
  vertex(nextX, ART_DISPLAY_H, 0, 1, 1);
  vertex(x, ART_DISPLAY_H, 0, 0, 1);
  endShape();
  
  // Recursive call to generate the next segment
  grass(nextX, nextY, depth + 1);
}

function texturedEllipse(x, y, w, h, img) {
  // Use beginShape to create a custom shape that we will texture
  texture(img);
  textureMode(IMAGE);
  beginShape();
   
  
  for (let theta = 0; theta < (2*PI); theta += 0.1) {
    // Calculate ellipse coordinates
    let xOffset = cos(theta) * w / 2;
    let yOffset = sin(theta) * h / 2;
    
    // Map the texture coordinates to the shape
    let u = map(cos(theta), -1, 1, 0, 1);
    let v = map(sin(theta), -1, 1, 0, 1);
    
    vertex(x + xOffset, y + yOffset, u * img.width, v * img.height);
  }
  endShape(CLOSE);
  textureMode(NORMAL);
}

function flipTheLock() {
      // Flip te value of the seed lock
      seedLock = !seedLock;
      console.log("Lock Flipped...");
}


function controlPanel(p) {
  var canopyWidth    = int(ART_DISPLAY_W/4);
  var canopyHeight   = int(ART_DISPLAY_H/4);
  var leaveWidth     = int(ART_DISPLAY_W/8);
  var leaveHeight    = int(ART_DISPLAY_H/8);
  var loweringFactor = int(ART_DISPLAY_H/8);
  var stumpWidth     = int(canopyWidth/6);
  var boughDivisions = int(5);
  var recursionDepth = int(5);
  var swayFactor     = int(1);
  var swellFactor    = int(2);
  var shiftFactor    = int(1);
  var twigFactor     = int(5);
  var shrinkFactor   = 0.125;
  var leaveFactor    = 1;
  var branchFactor   = 0.8;
  
  var canopyWSlider;
  var canopyHSlider;
  var leaveWSlider;
  var leaveHSlider;
  var stumpWSlider;
  var divSlider;
  var depthSlider;
  var lwrFactorSlider;
  var shiftSlider;
  var swaySlider;
  var swellSlider;
  var shrinkSlider;
  var leaveFacSlider;
  var branchFacSlider;
  var twigFacSlider;
  
  var button1;
  var button2;
  var button3;
  
  var defaults = true;
  
  
  p.setup = function() {
    // Initialize the canvases
    controlPanelCanvas = p.createCanvas(DISPLAY_W, DISPLAY_H/4);
    controlPanelCanvas.position(0, DISPLAY_H);
    
    // Setup the background image
    background(255);
    const grid = new Grid(GRID_NUM_X, GRID_NUM_Y, ART_DISPLAY_W, ART_DISPLAY_H );
    grid.draw();
    
    let xElements = 6;
    let yElements = 3;
    let xInterval = DISPLAY_W/xElements;
    let yInterval = (DISPLAY_H/6)/yElements;
    
    p.background(70, 61, 52);
    p.fill(178, 170, 158);
    p.rect(width/40, height/40, DISPLAY_W - width/20, DISPLAY_H/4 - height/20);
    
    p.fill(0);
    p.textAlign(LEFT);
    p.textSize(10);
    
    // Determine if we need to reset to the default values
    if (defaults) {
      canopyWidth    = int(ART_DISPLAY_W/4);
      canopyHeight   = int(ART_DISPLAY_H/4);
      leaveWidth     = int(ART_DISPLAY_W/8);
      leaveHeight    = int(ART_DISPLAY_H/8);
      loweringFactor = int(ART_DISPLAY_H/8);
      stumpWidth     = int(canopyWidth/6);
      boughDivisions = int(5);
      recursionDepth = int(5);
      swayFactor     = int(1);
      swellFactor    = int(2);
      shiftFactor    = int(1);
      twigFactor     = int(5);
      shrinkFactor   = 0.125;
      leaveFactor    = 1;
      branchFactor   = 0.8;
    }
    defaults = false;
    
    canopyWSlider = createSlider(DISPLAY_W/16, DISPLAY_W/2, canopyWidth);
    canopyWSlider.position(xInterval - canopyWSlider.width/2, DISPLAY_H + yInterval);
    canopyWSlider.size(60);
    p.text("Canopy Width", xInterval- canopyWSlider.width, yInterval);
    
    canopyHSlider = createSlider(DISPLAY_H/16, DISPLAY_H/2, canopyHeight);
    canopyHSlider.position(2 * xInterval - canopyHSlider.width/2, DISPLAY_H + yInterval);
    canopyHSlider.size(60);
    p.text("Canopy Height", 2 * xInterval - canopyHSlider.width, yInterval);
    
    leaveWSlider = createSlider(DISPLAY_W/64, DISPLAY_W/4, leaveWidth);
    leaveWSlider.position(3 * xInterval - leaveWSlider.width/2, DISPLAY_H + yInterval);
    leaveWSlider.size(60);
    p.text("Leaf Width", 3 * xInterval - leaveWSlider.width, yInterval);
    
    leaveHSlider = createSlider(DISPLAY_H/64, DISPLAY_H/4, leaveHeight);
    leaveHSlider.position(4 * xInterval - leaveHSlider.width/2, DISPLAY_H + yInterval);
    leaveHSlider.size(60);
    p.text("Leaf Height", 4 * xInterval - leaveHSlider.width, yInterval);
    
    stumpWSlider = createSlider(canopyWSlider.value()/16, canopyWSlider.value()/2, stumpWidth);
    stumpWSlider.position(5 * xInterval - stumpWSlider.width/2, DISPLAY_H + yInterval);
    stumpWSlider.size(60);
    p.text("Stump Width",5 * xInterval - stumpWSlider.width,yInterval);
    
    divSlider = createSlider(2, 7, boughDivisions);
    divSlider.position(xInterval - divSlider.width/2, DISPLAY_H + 2 * yInterval);
    divSlider.size(60);
    p.text("Divisions", xInterval - divSlider.width, 2 *yInterval);
    
    depthSlider = createSlider(1, 7, recursionDepth);
    depthSlider.position(2 *xInterval - depthSlider.width/2, DISPLAY_H + 2 * yInterval);
    depthSlider.size(60);
    p.text("Depth", 2 * xInterval - depthSlider.width, 2 *yInterval);
    
    lwrFactorSlider = createSlider(-DISPLAY_H/4, DISPLAY_H/4, loweringFactor);
    lwrFactorSlider.position(3 *xInterval - lwrFactorSlider.width/2, DISPLAY_H + 2 *yInterval);
    lwrFactorSlider.size(60);
    p.text("Lower", 3 * xInterval - lwrFactorSlider.width, 2 * yInterval);
    
    shiftSlider = createSlider(1, 6, shiftFactor);
    shiftSlider.position(4 * xInterval - shiftSlider.width/2, DISPLAY_H + 2 * yInterval);
    shiftSlider.size(60);
    p.text("Shift", 4 * xInterval - shiftSlider.width, 2 * yInterval);
    
    swaySlider = createSlider(-DISPLAY_W/4, DISPLAY_W/4, swayFactor);
    swaySlider.position(5 * xInterval - swaySlider.width/2, DISPLAY_H + 2 * yInterval);
    swaySlider.size(60);
    p.text("Sway", 5 * xInterval - swaySlider.width, 2 * yInterval);
    
    swellSlider = createSlider(1, 5, swellFactor);
    swellSlider.position(xInterval - swellSlider.width/2, DISPLAY_H + 3 * yInterval);
    swellSlider.size(60);
    p.text("Swell",xInterval - swellSlider.width, 3 * yInterval);
    
    shrinkSlider = createSlider(10, 15, shrinkFactor);
    shrinkSlider.position(2 * xInterval - shrinkSlider.width/2, DISPLAY_H + 3 * yInterval);
    shrinkSlider.size(60);
    p.text("Shrink",2 * xInterval - shrinkSlider.width, 3 * yInterval);
    
    leaveFacSlider = createSlider(1, 3, leaveFactor);
    leaveFacSlider.position(3 * xInterval - leaveFacSlider.width/2, DISPLAY_H + 3 * yInterval);
    leaveFacSlider.size(60);
    p.text("Leaf Qty.",3 * xInterval - leaveFacSlider.width, 3 * yInterval);
    
    branchFacSlider = createSlider(1, 10, branchFactor);
    branchFacSlider.position(4 * xInterval - branchFacSlider.width/2, DISPLAY_H + 3 * yInterval);
    branchFacSlider.size(60);
    p.text("Branch Qty.",4 * xInterval - branchFacSlider.width, 3 * yInterval);
    
    twigFacSlider = createSlider(2, 6, twigFactor);
    twigFacSlider.position(5 * xInterval - twigFacSlider.width/2, DISPLAY_H + 3 * yInterval);
    twigFacSlider.size(60);
    p.text("Twig Qty.",5 * xInterval - twigFacSlider.width, 3 * yInterval);
    
  }
  

  
  p.draw = function() {
    function generate() {
      generating = true;
      p.draw();
      if (!seedLock) seed = random(10000);
      
      clear();
      redraw();
      background(255);
      const grid = new Grid(GRID_NUM_X, GRID_NUM_Y, ART_DISPLAY_W, ART_DISPLAY_H );
      grid.draw();
      grass(-ART_DISPLAY_W/2, 7 * (ART_DISPLAY_H/16), 0);
      
      canopyWidth = canopyWSlider.value();
      canopyHeight = canopyHSlider.value();
      leaveWidth = leaveWSlider.value();
      leaveHeight = leaveHSlider.value();
      leaveFactor = leaveFacSlider.value();
      loweringFactor = lwrFactorSlider.value();
      swayFactor = swaySlider.value();
      shrinkFactor = shrinkSlider.value()/100;
      swellFactor = swellSlider.value();
      shiftFactor = shiftSlider.value();
      branchFactor = branchFacSlider.value()/10;
      twigFactor = twigFacSlider.value();
      boughDivisions = divSlider.value();
      recursionDepth = depthSlider.value();
      
      
      
      tree = new TreeGenerator(canopyWidth, canopyHeight, leaveWidth,
                           leaveHeight, leaveFactor, loweringFactor,
                           swayFactor, stumpWidth, shrinkFactor,
                           swellFactor, shiftFactor, branchFactor,
                           twigFactor, boughDivisions, recursionDepth);
      
      tree.draw();  
      generating = false;
    }
    
    
    function reset() {
      // Clear the canvas
      p.clear();
      removeElements();
      
      // Make sure we reset the sliders
      defaults = true;
      
      // Setup a new control panel
      p.setup();
    }
    
    let xElements = 6;
    let yElements = 3;
    let xInterval = DISPLAY_W/xElements;
    let yInterval = (DISPLAY_H/6)/yElements;
    
    p.fill(0);
    p.textAlign(LEFT);
    p.textSize(8);
    
    // Add the generate button
    if (!generating) {
      button1= createButton("Generate");
      button1.style('font-size', '10px');
      button1.position(xInterval * 6 - (button1.width) - DISPLAY_W/64, DISPLAY_H + yInterval);
      button1.mousePressed(generate);
    } else {
      button1= createButton("Generate");
      button1.style('font-size', '10px');
      button1.position(xInterval * 6 - (button1.width) - DISPLAY_W/64, DISPLAY_H + yInterval);
      button1.style('background-color', "Grey");
      button1.mousePressed(generate);
    }
    
    // Add the seed lock button
    if (!seedLock) {
      button2 = createButton("Seed Lock");
      button2.style('font-size', '10px');
      button2.position(xInterval * 6 - (button2.width), DISPLAY_H + 2 * yInterval);
      button2.mousePressed(flipTheLock);
      p.fill(178, 170, 158);
      p.noStroke();
      p.rect(xInterval * 6 - (xInterval/2.4), 2.5 * yInterval, DISPLAY_W/28, DISPLAY_H/28);
      p.fill(0);
    } else {
      button2 = createButton("Seed Lock");
      button2.style('font-size', '10px');
      button2.position(xInterval * 6 - (button2.width), DISPLAY_H + 2 * yInterval);
      button2.style('background-color', "Grey");
      button2.mousePressed(flipTheLock);
    }
    
    // Add the reset button
    button3 = createButton("Reset");
    button3.style('font-size', '10px');
    button3.position(xInterval * 6 - (1.55 * button3.width), DISPLAY_H + 3 * yInterval);
    button3.mousePressed(reset);
    
    p.textAlign(LEFT);
    p.textSize(10);
  }
}

function preload() {
  console.log("preload()");
  BARK_TEXTURES[0] = loadImage("https://i.imgur.com/0EvI3fn.jpeg");
  BARK_TEXTURES[1] = loadImage("https://i.imgur.com/xAtZ1Hq.jpeg");
  BARK_TEXTURES[2] = loadImage("https://i.imgur.com/QTiJYln.jpeg");
  BARK_TEXTURES[3] = loadImage("https://i.imgur.com/Oa1MG1Y.jpeg");
  BARK_TEXTURES[4] = loadImage("https://i.imgur.com/0lB3mt5.jpeg");
  BARK_TEXTURES[5] = loadImage("https://i.imgur.com/5fizGT6.jpeg");
  BARK_TEXTURES[6] = loadImage("https://i.imgur.com/NvPZXcA.jpeg");   
  BARK_TEXTURES[7] = loadImage("https://i.imgur.com/xZwtPn9.jpeg");
                              
  GRASS_TEXTURES[0] = loadImage("https://i.imgur.com/ebi5fQw.jpeg");
  GRASS_TEXTURES[1] = loadImage("https://i.imgur.com/J4OWzxa.jpeg");
  GRASS_TEXTURES[2] = loadImage("https://i.imgur.com/wWwGPay.jpeg");
  GRASS_TEXTURES[3] = loadImage("https://i.imgur.com/7QtOucs.jpeg");
  GRASS_TEXTURES[4] = loadImage("https://i.imgur.com/SPLzY8j.jpeg");
  
  LEAVE_TEXTURES[0] = loadImage("https://i.imgur.com/3cvFIFC.png");
  LEAVE_TEXTURES[1] = loadImage("https://i.imgur.com/Sv6Rqak.png");
  LEAVE_TEXTURES[2] = loadImage("https://i.imgur.com/Bp5PXT2.png");
  LEAVE_TEXTURES[3] = loadImage("https://i.imgur.com/ODg4HuN.png");
}

function setup() {
  console.log("setup()");
  let canvas = createCanvas(DISPLAY_W, DISPLAY_H, WEBGL);
  let treeGraphic = createGraphics(ART_DISPLAY_W, ART_DISPLAY_H);
  canvas.position(0, 0);
  background(255);
  textureMode(NORMAL);
  new p5(controlPanel);
}