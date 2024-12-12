private static final int DISPLAY_WIDTH = 850;           
private static final int DISPLAY_HEIGHT = 1100;
private PImage bark1, bark2, bark3, bark4, bark5, bark6, bark7, bark8;
private PImage grass1, grass2, grass3, grass4, grass5;
private PImage leaves1, leaves2, leaves3, leaves4;
private PImage[] bark = {bark1, bark2, bark3, bark4, bark5, bark6, bark7, bark8};
private PImage[] grass = {grass1, grass2, grass3, grass4, grass5};
private PImage[] leaves = {leaves1, leaves2, leaves3, leaves4};
private PGraphics background;

public class Grid {
  private int num_x;
  private int num_y;
  private int w;
  private int h;
  
  public Grid(int num_x, int num_y, int w, int h) {
    this.num_x = num_x;
    this.num_y = num_y;
    this.w = w;
    this.h = h;
  }
  
  public void draw() {
    for (int i=-h/num_y; i <= num_y; i++) {
      line(0, h/num_y * i, w, h/num_y * i);
    }
    for (int i=-w/num_x; i <= num_x; i++) {
      line(w/num_x * i, 0, w/num_x * i, h);
    }
  }
}

public class TreeGenerator {
  private int canopy_width;
  private int canopy_height;
  private int leave_width;
  private int leave_height;
  private int lowering_factor;
  private int sway_factor;
  private int stump_width;
  private int swell_factor;
  private int shift_factor;
  private int bough_divisions;
  private int recursion_depth;
  private int twig_factor;
  private float shrink_factor;
  private float leave_factor;
  private float branch_factor;
  
  public TreeGenerator(int canopy_width, int canopy_height, int leave_width, int leave_height, float leave_factor, int lowering_factor,int sway_factor,
         int stump_width, float shrink_factor, int swell_factor, int shift_factor, float branch_factor, int twig_factor, int bough_divisions, int recursion_depth) {
    this.canopy_width    = canopy_width;
    this.canopy_height   = canopy_height;
    this.leave_width     = leave_width;
    this.leave_height    = leave_height;
    this.leave_factor    = leave_factor;
    this.lowering_factor = lowering_factor;
    this.sway_factor     = sway_factor;
    this.stump_width     = stump_width;
    this.shrink_factor   = shrink_factor;
    this.swell_factor    = swell_factor;
    this.shift_factor    = shift_factor;
    this.branch_factor   = branch_factor;
    this.twig_factor     = twig_factor;
    this.bough_divisions = bough_divisions;
    this.recursion_depth = recursion_depth;
  }
  
  private void stump(int curr_x1, int curr_y1, int curr_x2, int curr_y2, int prev_x1, int prev_y1, int prev_x2, int prev_y2, int depth) {
    if (depth == 12){
      return;
    }
    
    boolean long_log = ((int) random(2) == 0);
    int x_offset = 0;
    int swell = (DISPLAY_WIDTH/256) * (swell_factor * (1 + depth));
    if (long_log) { x_offset = (int) random(-DISPLAY_WIDTH/32 * shift_factor, DISPLAY_WIDTH/32 * shift_factor); }
    else { x_offset = (int) random(-DISPLAY_WIDTH/64 * shift_factor, DISPLAY_WIDTH/64 * shift_factor); }
    
    PImage curr_bark = bark[(int) random(8)];
    noStroke();
    beginShape();
    texture(curr_bark);
    vertex(prev_x1, prev_y1, 0, 0);
    vertex(prev_x2, prev_y2, curr_bark.width, 0);
    vertex(curr_x2 + x_offset + swell, curr_y2, curr_bark.width, curr_bark.height);
    vertex(curr_x1 + x_offset - swell, curr_y1, 0, curr_bark.height);
    endShape();
    
    if (branch_factor >= 1) {
      for (int j=0; j<branch_factor; j++) {
        int divisions = abs(bough_divisions - depth - 1);
        int levels = abs(recursion_depth - depth - 1);
        boughs(curr_x1, curr_y1, (stump_width * twig_factor) / (depth + 1), (stump_width * twig_factor) / (depth + 1), 0, divisions, levels);
      }
    } else {
      if (random(0, 1) < branch_factor) {
        int divisions = abs(bough_divisions - depth - 1);
        int levels = abs(recursion_depth - depth - 1);
        boughs(curr_x1, curr_y1, (stump_width * twig_factor) / (depth + 1), (stump_width * twig_factor) / (depth + 1), 0, divisions, levels);
      }
    }
    
    if (long_log) {
      stump(curr_x1 + x_offset, curr_y1 + (DISPLAY_HEIGHT/16), curr_x2 + x_offset, curr_y2 + (DISPLAY_HEIGHT/16),
      curr_x1 + x_offset - swell, curr_y1, curr_x2 + x_offset + swell, curr_y2, depth+1);
    }
    else {
      stump(curr_x1 + x_offset, curr_y1 + (DISPLAY_HEIGHT/8), curr_x2 + x_offset, curr_y2 + (DISPLAY_HEIGHT/16),
      curr_x1 + x_offset - swell, curr_y1, curr_x2 + x_offset + swell, curr_y2, depth+1);
    }
    
  }
  
  private void boughs(int x, int y, int x_radius, int y_radius, int depth, int divisions, int levels) {
    // Base case
    if (depth == levels) {
      return;
    }
    
    float[] prev_angles = new float[levels];
    textured_ellipse(x, y, (x_radius * 2) * shrink_factor, (y_radius * 2) * shrink_factor, bark[(int) random(8)]);
    
    for (int i=0; i<divisions; i++) {
      
      // Generate the foundational angle for this branch, and guarentee that it is unique
      float angle1 = random(PI - (PI/4), 2*PI + (PI/4));
      boolean new_angle_found = false;
      while (!new_angle_found) {
        boolean valid = true;
        for (float curr_angle : prev_angles) {
          if (angle1 > (curr_angle - (PI/8)) && angle1 < (curr_angle + (PI/8))) {
            valid = false;
          }
        }
        if (valid) {
          new_angle_found = true;
        } else {
          angle1 = random(PI - (PI/4), 2*PI + (PI/4));
        }
        
      }
      
      // Calculate the complementary angles based off the foundational angle
      float angle2 = angle1 + ((PI/32)/(depth+1));
      
      // Add the foundational angle to previous angles
      prev_angles = append(prev_angles, angle1);
      
      // Select a bark texture
      PImage curr_bark = bark[(int) random(8)];
      
      // Select an offset for the radius
      int x_radius_offset = (int) random(-x_radius/16, x_radius/16);
      int y_radius_offset = (int) random(-y_radius/16, y_radius/16);
      
      // Calculate each corner's coordinate based off the angles generated
      int top_left_x   = (int) (x + ((x_radius + x_radius_offset) * cos(angle1)));
      int top_left_y   = (int) (y + ((y_radius + y_radius_offset) * sin(angle1)));
      int top_right_x  = (int) (x + ((x_radius + x_radius_offset) * cos(angle2)));
      int top_right_y  = (int) (y + ((y_radius + y_radius_offset) * sin(angle2)));
      int bot_right_x  = (int) (x + (((x_radius + x_radius_offset)* shrink_factor) * cos(angle1 + radians(90))));
      int bot_right_y  = (int) (y + (((y_radius + y_radius_offset)* shrink_factor) * sin(angle1 + radians(90))));
      int bot_left_x   = (int) (x + (((x_radius + x_radius_offset)* shrink_factor) * cos(angle1)));
      int bot_left_y   = (int) (y + (((y_radius + y_radius_offset)* shrink_factor) * sin(angle1)));
      
      if (leave_factor >= 1) for (int j=0; j<leave_factor; j++) {
        this.leaves(top_left_x, top_left_y, leave_width / (2* (1 + depth)), leave_height / (1 + depth));
      }
      else {
        if (random(0, 1) < leave_factor) {
          this.leaves(top_left_x, top_left_y, leave_width / (2* (1 + depth)), leave_height / (1 + depth));
        }
      }
      
      // Draw the bough
      noStroke();
      beginShape();
      texture(curr_bark);
      vertex(top_left_x, top_left_y, 0, curr_bark.height);
      vertex(top_right_x, top_right_y, curr_bark.width, curr_bark.height);
      vertex(bot_right_x, bot_right_y, curr_bark.width, 0);
      vertex(bot_left_x, bot_left_y, 0, 0);
      endShape();
      
      // Calcuate the center x & y coordinates for the next set of boughs
      int new_center_x = (top_left_x + top_right_x) / 2;
      int new_center_y = (top_left_y + top_right_y) / 2;
      
      // Recursive call
      boughs(new_center_x, new_center_y, x_radius/2, y_radius/2, depth + 1, divisions, levels);
    }
  }
  
  private void leaves(int x, int y, int w, int h) {
    imageMode(CENTER);
    pushMatrix();
    
    // Move the origin to the (x, y) position
    translate(x, y);
    
    // Rotate the image around the new origin
    rotate(radians( random(0, 360))); 
    
    // Draw the image so that its bottom center aligns with (x, y)
    image(leaves[(int) random(4)], 0, -h/2, w, h); 
  
    popMatrix();
  }
  
  public void draw() {
    // Draw the grass
    grass(0, 15 * (DISPLAY_HEIGHT/16), 0);
    
    // Draw the stump
    int prev_x1 = (DISPLAY_WIDTH /2)  - (stump_width/2) + sway_factor;
    int prev_y1 = (DISPLAY_HEIGHT/2)  + lowering_factor;
    int prev_x2 = (DISPLAY_WIDTH /2)  + (stump_width/2) + sway_factor;
    int prev_y2 = (DISPLAY_HEIGHT/2)  + lowering_factor;
    int curr_x1 = (DISPLAY_WIDTH /2)  - (stump_width/2) + sway_factor;
    int curr_y1 = (DISPLAY_HEIGHT/2)  - (DISPLAY_HEIGHT/8) + lowering_factor;
    int curr_x2 = (DISPLAY_WIDTH /2)  + (stump_width/2) + sway_factor;
    int curr_y2 = (DISPLAY_HEIGHT/2)  - (DISPLAY_HEIGHT/8) + lowering_factor;
    this.stump(prev_x1, prev_y1, prev_x2, prev_y2, curr_x1, curr_y1, curr_x2, curr_y2, 0);
    
    // Draw the boughs
    int branch_x  = DISPLAY_WIDTH/2 + sway_factor;
    int branch_y  = (DISPLAY_HEIGHT/2) - (DISPLAY_HEIGHT/8) + lowering_factor;
    int x_radius  = canopy_width;
    int y_radius  = canopy_width;
    int depth     = 0;
    int divisions = bough_divisions;
    int levels    = recursion_depth;
    this.boughs(branch_x, branch_y, x_radius, y_radius, depth , divisions, levels);
  }
}

void textured_ellipse(float x, float y, float w, float h, PImage img) {
  // Use beginShape to create a custom shape that we will texture
  beginShape();
  texture(img); 
  
  for (float theta = 0; theta < (2*PI); theta += 0.1) {
    // Calculate ellipse coordinates
    float x_offset = cos(theta) * w / 2;
    float y_offset = sin(theta) * h / 2;
    
    // Map the texture coordinates to the shape
    float u = map(cos(theta), -1, 1, 0, 1);
    float v = map(sin(theta), -1, 1, 0, 1);
    
    vertex(x + x_offset, y + y_offset, u * img.width, v * img.height);
  }
  endShape(CLOSE);
}
  
public void grass(int x, int y, int depth) {
  if (depth == 20) {
    return;
  }
  
  int next_x = x + (int) random(DISPLAY_WIDTH/16, DISPLAY_WIDTH/8);
  int next_y = y + (int) random(-DISPLAY_WIDTH/32, DISPLAY_WIDTH/32);
  
  PImage curr_grass = grass[(int) random(5)];
  noStroke();
  beginShape();
  texture(curr_grass);
  vertex(x, y, 0, 0);
  vertex(next_x, next_y, curr_grass.width, 0);
  vertex(next_x, height, curr_grass.width, curr_grass.height);
  vertex(x, height, 0, curr_grass.height);
  endShape();
  
  grass(next_x, next_y, depth + 1);
}

public void settings() {
  // Set window size
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT, P3D);
}

public void setup() {
  // Setup the graphics oject using display constants
  background = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT);
  
  // Draw a grid onto the canvas 
  Grid grid = new Grid(16, 16, DISPLAY_WIDTH, DISPLAY_HEIGHT);
  grid.draw();
  
  // Load all of the images which will be used in the program
  bark[0] = loadImage("bark1.jpeg");
  bark[1] = loadImage("bark2.jpeg");
  bark[2] = loadImage("bark3.jpeg");
  bark[3] = loadImage("bark4.jpeg");
  bark[4] = loadImage("bark5.jpeg");
  bark[5] = loadImage("bark6.jpeg");
  bark[6] = loadImage("bark7.jpeg");
  bark[7] = loadImage("bark8.jpeg");
  grass[0] = loadImage("grass1.jpeg");
  grass[1] = loadImage("grass2.jpeg");
  grass[2] = loadImage("grass3.jpeg");
  grass[3] = loadImage("grass4.jpeg");
  grass[4] = loadImage("grass5.jpeg");
  leaves[0] = loadImage("leaves1.png");
  leaves[1] = loadImage("leaves2.png");
  leaves[2] = loadImage("leaves3.png");
  leaves[3] = loadImage("leaves4.png");
  noLoop();
  imageMode(CENTER);
}

public void draw() {
  // Initialize all of the Tree's parameters
  int canopy_width;     // This parameter affects how wide the tree's canopy will be
  int canopy_height;    // This parameter affect how tall the tree's canopy will be
  int leave_width;      // This parameter affects the (initial) width of the leaves
  int leave_height;     // This parameter affcets the (initial) height of the leaves
  int bough_divisions;  // This parameter affects how many child boughs will divide off each parent branch
  int recursion_depth;  // This parameter affects how many how many times a branch will divide
  int lowering_factor;  // This parameter allows for the entire tree to be moved up or down
  int sway_factor;      // This parameter allows for the entire tree to be moved side to side
  int swell_factor;     // This parameter affects how wide the stump gets the lower you go down
  int shift_factor;     // This parameter affects how much the stump shifts side to side the lower you go down
  int stump_width;      // This parameter affects the width of the tree's stump (best to use multiple of canopy_width)
  int twig_factor;      // This parameter affect the size of the twigs which grow from the tree's trunl
  float shrink_factor;  // This parameter affects how much thinner a branch gets during each recursion (initially stump_width)
  float leave_factor;   // This parameter affects how man leaves exist each node contains (<0 means there is a chance of a leave)
  float branch_factor;  // This parameter affects how many branches will be generated on the stump (<0 means there is a chance of a branch)
  
  // Set the parameters for the Tree we are drawing // DEFAULTS
  canopy_width    = DISPLAY_WIDTH/4;                // DISPLAY_WIDTH/4
  canopy_height   = DISPLAY_HEIGHT/4;               // DISPLAY_HEIGHT/4
  leave_width     = DISPLAY_WIDTH/14;               // DISPLAY_WIDTH/14
  leave_height    = DISPLAY_HEIGHT/14;              // DISPLAY_HEIGHT/14
  stump_width     = canopy_width/6;                 // canopy_width/6
  bough_divisions = 5;                              // 5
  recursion_depth = 7;                              // 7
  lowering_factor = DISPLAY_HEIGHT/8;               // DISPLAY_HEIGHT/8
  sway_factor     = 1;                              // 1
  swell_factor    = 2;                              // 2
  shift_factor    = 1;                              // 1
  twig_factor     = 5;                              // 5
  shrink_factor   = 0.125;                          // 0.125
  leave_factor    = 0.5;                            // 0.5
  branch_factor   = 0.8;                            // 0.8
  
  
  // If we want to randomize the Tree's parameters, we can use this code
  boolean randomize = false;
  if (randomize) {
    canopy_width    = (int) random(DISPLAY_WIDTH/16, DISPLAY_WIDTH/2);
    canopy_height   = (int) random(DISPLAY_HEIGHT/16, DISPLAY_HEIGHT/2);
    leave_width     = (int) random(DISPLAY_WIDTH/64, DISPLAY_WIDTH/4);
    leave_height    = (int) random(DISPLAY_HEIGHT/64, DISPLAY_HEIGHT/4);
    bough_divisions = (int) random(2, 8);
    recursion_depth = (int) random(2, 7);
    lowering_factor = (int) random(-DISPLAY_HEIGHT/4, DISPLAY_HEIGHT/4);
    sway_factor     = (int) random(-DISPLAY_WIDTH/4, DISPLAY_WIDTH/4);
    stump_width     = (int) random(canopy_width/16, canopy_width/2);
    swell_factor    = (int) random(1, 5);
    shift_factor    = (int) random(1, 5);
    twig_factor     = (int) random(2, 6);
    shrink_factor   = random(0.01, 0.2);
    leave_factor    = random(0.1, 3);
    branch_factor   = random(0.1, 1);
  }
  
  // Initialize a new Tree object using the parameters we set
  TreeGenerator tree = new TreeGenerator(canopy_width, canopy_height, leave_width, leave_height, leave_factor, lowering_factor,sway_factor,
                       stump_width, shrink_factor, swell_factor, shift_factor, branch_factor, twig_factor, bough_divisions, recursion_depth);
  
  // Draw the tree to the canvas
  tree.draw();
  
  // Save the drawing to a png image
  saveFrame("artwork.png");
  
 
}
