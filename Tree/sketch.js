var DISPLAY_WIDTH = 500;           
var DISPLAY_HEIGHT = 500;
var barkTextures = [];
var grassTextures = [];
var leaveTextures = [];
var backgroundGraphics;
var branchesGenerated = 0;
const MAX_DEPTH = 12;             // Maximum depth for recursion
const MAX_BRANCHES = 10;          // Maximum number of branches
const INITIAL_DIVISIONS = 1;      // Initial division value
const INITIAL_LEVELS = 1;         // Initial level value
const BRANCH_FACTOR_LIMIT = 0.2;  // Limit for branch factor to reduce branches

function Grid(num_x, num_y, w, h) {
  this.num_x = num_x;
  this.num_y = num_y;
  this.w = w;
  this.h = h;
  
  this.draw = function() {
    for (var i=-h/num_y; i <= num_y; i++) {
      line(0, h/num_y * i, w, h/num_y * i);
    }
    for (var i=-w/num_x; i <= num_x; i++) {
      line(w/num_x * i, 0, w/num_x * i, h);
    }
  };
}

function TreeGenerator(canopy_width, canopy_height, leave_width, leave_height, leave_factor, lowering_factor, sway_factor,
         stump_width, shrink_factor, swell_factor, shift_factor, branch_factor, twig_factor, bough_divisions, recursion_depth) {
  this.canopy_width = canopy_width;
  this.canopy_height = canopy_height;
  this.leave_width = leave_width;
  this.leave_height = leave_height;
  this.leave_factor = leave_factor;
  this.lowering_factor = lowering_factor;
  this.sway_factor = sway_factor;
  this.stump_width = stump_width;
  this.shrink_factor = shrink_factor;
  this.swell_factor = swell_factor;
  this.shift_factor = shift_factor;
  this.branch_factor = branch_factor;
  this.twig_factor = twig_factor;
  this.bough_divisions = bough_divisions;
  this.recursion_depth = recursion_depth;

  this.stump = function(curr_x1, curr_y1, curr_x2, curr_y2, prev_x1, prev_y1, prev_x2, prev_y2, depth) {
    if (depth >= 12) return;

    var long_log = (int(random(2)) == 0);
    var x_offset = 0;
    var swell = (DISPLAY_WIDTH / 256) * (this.swell_factor * (1 + depth));
    if (long_log) x_offset = int(random(-DISPLAY_WIDTH / 32 * this.shift_factor, DISPLAY_WIDTH / 32 * this.shift_factor));
    else x_offset = int(random(-DISPLAY_WIDTH / 64 * this.shift_factor, DISPLAY_WIDTH / 64 * this.shift_factor));

    var curr_bark = barkTextures[int(random(8))];
    noStroke();
    beginShape();
    texture(curr_bark);
    vertex(prev_x1, prev_y1, 0, 0);
    vertex(prev_x2, prev_y2, curr_bark.width, 0);
    vertex(curr_x2 + x_offset + swell, curr_y2, curr_bark.width, curr_bark.height);
    vertex(curr_x1 + x_offset - swell, curr_y1, 0, curr_bark.height);
    endShape();

    if (this.branch_factor >= 1) {
      for (var j = 0; j < this.branch_factor; j++) {
        let divisions = abs(this.bough_divisions - depth - 1);
        let levels = abs(this.recursion_depth - depth - 1);
        this.boughs(curr_x1, curr_y1, (this.stump_width * this.twig_factor) / (depth + 1),
                    (this.stump_width * this.twig_factor) / (depth + 1), 0, divisions, levels);
      }
    } else {
      if (random(0, 1) < this.branch_factor) {
        let divisions = abs(this.bough_divisions - depth - 1);
        let levels = abs(this.recursion_depth - depth - 1);
        this.boughs(curr_x1, curr_y1, (this.stump_width * this.twig_factor) / (depth + 1),
                    (this.stump_width * this.twig_factor) / (depth + 1), 0, divisions, levels);
      }
    }

    if (long_log) {
      this.stump(curr_x1 + x_offset, curr_y1 + (DISPLAY_HEIGHT / 16), curr_x2 + x_offset, curr_y2 + (DISPLAY_HEIGHT / 16),
        curr_x1 + x_offset - swell, curr_y1, curr_x2 + x_offset + swell, curr_y2, depth + 1);
    } else {
      this.stump(curr_x1 + x_offset, curr_y1 + (DISPLAY_HEIGHT / 8), curr_x2 + x_offset, curr_y2 + (DISPLAY_HEIGHT / 16),
        curr_x1 + x_offset - swell, curr_y1, curr_x2 + x_offset + swell, curr_y2, depth + 1);
    }
  };

  this.boughs = function(x, y, x_radius, y_radius, depth, divisions, levels) {
    if (depth >= levels || depth >= MAX_DEPTH) {
        return; 
    }

    let prev_angles = [];
    textured_ellipse(x, y, (x_radius * 2) * this.shrink_factor, (y_radius * 2) * this.shrink_factor, barkTextures[int(random(8))]);

    for (var i = 0; i < divisions; i++) {
        var angle1 = random(PI - (PI / 4), 2 * PI + (PI / 4));
        var new_angle_found = false;

        // Limit the recursive calls by ensuring angles are far enough apart
        while (!new_angle_found) {
            var valid = true;
            for (var j = 0; j < prev_angles.length; j++) {
                if (angle1 > (prev_angles[j] - (PI / 8)) && angle1 < (prev_angles[j] + (PI / 8))) {
                    valid = false;
                }
            }
            if (valid) {
                new_angle_found = true;
            } else {
                angle1 = random(PI - (PI / 4), 2 * PI + (PI / 4));
            }
        }

        prev_angles.push(angle1);
        var angle2 = angle1 + ((PI / 32) / (depth + 1));
        var curr_bark = barkTextures[int(random(8))];

        var x_radius_offset = int(random(-x_radius / 16, x_radius / 16));
        var y_radius_offset = int(random(-y_radius / 16, y_radius / 16));

        var top_left_x = int(x + ((x_radius + x_radius_offset) * cos(angle1)));
        var top_left_y = int(y + ((y_radius + y_radius_offset) * sin(angle1)));
        var top_right_x = int(x + ((x_radius + x_radius_offset) * cos(angle2)));
        var top_right_y = int(y + ((y_radius + y_radius_offset) * sin(angle2)));

        this.leaves(top_left_x, top_left_y, this.leave_width / (2 * (1 + depth)), this.leave_height / (1 + depth));
        
        branchesGenerated += 1;
        if (branchesGenerated >= MAX_BRANCHES) {
            return;  // Stop if too many branches have been generated
        }

        // Recursively call boughs to generate more branches, but stop if too deep
        var new_center_x = (top_left_x + top_right_x) / 2;
        var new_center_y = (top_left_y + top_right_y) / 2;
        this.boughs(new_center_x, new_center_y, x_radius / 2, y_radius / 2, depth + 1, divisions, levels);
    }
  };

  this.leaves = function(x, y, w, h) {
    imageMode(CENTER);
    push();
    translate(x, y);
    rotate(radians(random(0, 360))); 
    image(leaveTextures[int(random(4))], 0, -h / 2, w, h); 
    pop();
  };

  this.draw = function() {
    grass(0, 15 * (DISPLAY_HEIGHT / 16), 0);
    var prev_x1 = (DISPLAY_WIDTH / 2) - (this.stump_width / 2) + this.sway_factor;
    var prev_y1 = (DISPLAY_HEIGHT / 2) + this.lowering_factor;
    var prev_x2 = (DISPLAY_WIDTH / 2) + (this.stump_width / 2) + this.sway_factor;
    var prev_y2 = (DISPLAY_HEIGHT / 2) + this.lowering_factor;
    var curr_x1 = (DISPLAY_WIDTH / 2) - (this.stump_width / 2) + this.sway_factor;
    var curr_y1 = (DISPLAY_HEIGHT / 2) - (DISPLAY_HEIGHT / 8) + this.lowering_factor;
    var curr_x2 = (DISPLAY_WIDTH / 2) + (this.stump_width / 2) + this.sway_factor;
    var curr_y2 = (DISPLAY_HEIGHT / 2) - (DISPLAY_HEIGHT / 8) + this.lowering_factor;
    this.stump(prev_x1, prev_y1, prev_x2, prev_y2, curr_x1, curr_y1, curr_x2, curr_y2, 0);
  };
}

function grass(x, y, w) {
  var curr_grass = grassTextures[int(random(4))];
  for (var i = 0; i < DISPLAY_WIDTH; i += curr_grass.width) {
    image(curr_grass, i, y);
  }
}

function textured_ellipse(x, y, w, h, tex) {
  beginShape();
  texture(tex);
  vertex(x - w / 2, y - h / 2, 0, 0);
  vertex(x + w / 2, y - h / 2, tex.width, 0);
  vertex(x + w / 2, y + h / 2, tex.width, tex.height);
  vertex(x - w / 2, y + h / 2, 0, tex.height);
  endShape();
}

function setup() {
  console.log("setup()...");
  
  // Initialize the main canvas with WEBGL mode
  createCanvas(DISPLAY_WIDTH, DISPLAY_HEIGHT, WEBGL);
  
  barkTextures[0] = loadImage("https://i.imgur.com/0EvI3fn.jpeg");
  barkTextures[1] = loadImage("https://i.imgur.com/xAtZ1Hq.jpeg");
  barkTextures[2] = loadImage("https://i.imgur.com/QTiJYln.jpeg");
  barkTextures[3] = loadImage("https://i.imgur.com/Oa1MG1Y.jpeg");
  barkTextures[4] = loadImage("https://i.imgur.com/0lB3mt5.jpeg");                          
  barkTextures[5] = loadImage("https://i.imgur.com/5fizGT6.jpeg");
  barkTextures[6] = loadImage("https://i.imgur.com/NvPZXcA.jpeg");                            
  barkTextures[7] = loadImage("https://i.imgur.com/xZwtPn9.jpeg");
                              
  grassTextures[0] = loadImage("https://i.imgur.com/ebi5fQw.jpeg");
  grassTextures[1] = loadImage("https://i.imgur.com/J4OWzxa.jpeg");
  grassTextures[2] = loadImage("https://i.imgur.com/wWwGPay.jpeg");
  grassTextures[3] = loadImage("https://i.imgur.com/7QtOucs.jpeg");
  grassTextures[4] = loadImage("https://i.imgur.com/SPLzY8j.jpeg");
  
  leaveTextures[0] = loadImage("https://i.imgur.com/3cvFIFC.png");
  leaveTextures[1] = loadImage("https://i.imgur.com/Sv6Rqak.png");
  leaveTextures[2] = loadImage("https://i.imgur.com/Bp5PXT2.png");
  leaveTextures[3] = loadImage("https://i.imgur.com/ODg4HuN.png");
  console.log("  images loaded");
  
  backgroundGraphics = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT, WEBGL);
  console.log("  graphics created\n");
  draw();
}

function draw() {
  console.log("draw()...");
  image(backgroundGraphics, 0, 0);
  var grid = new Grid(8, 10, DISPLAY_WIDTH, DISPLAY_HEIGHT);
  grid.draw();
  
  var canopy_width    = DISPLAY_WIDTH/4;                // DISPLAY_WIDTH/4
  var canopy_height   = DISPLAY_HEIGHT/4;               // DISPLAY_HEIGHT/4
  var leave_width     = DISPLAY_WIDTH/14;               // DISPLAY_WIDTH/14
  var leave_height    = DISPLAY_HEIGHT/14;              // DISPLAY_HEIGHT/14
  var stump_width     = canopy_width/6;                 // canopy_width/6
  var bough_divisions = 1;                              // 5
  var recursion_depth = 1;                              // 7
  var lowering_factor = DISPLAY_HEIGHT/8;               // DISPLAY_HEIGHT/8
  var sway_factor     = 1;                              // 1
  var swell_factor    = 2;                              // 2
  var shift_factor    = 1;                              // 1
  var twig_factor     = 5;                              // 5
  var shrink_factor   = 0.125;                          // 0.125
  var leave_factor    = 0.5;                            // 0.5
  var branch_factor   = 0.2;                            // 0.8
  
  
  var treeGen = new TreeGenerator(canopy_width, canopy_height, leave_width, leave_height, leave_factor,
                                  sway_factor, stump_width, shrink_factor, swell_factor, shift_factor,
                                  branch_factor, twig_factor, bough_divisions, recursion_depth);
  treeGen.draw();
}
