/**
* AUTHOR:
* Ryan Rizzo
* 
* FILE:
* Gyration.pde
* 
* DATE:
* 12/25/22
* 
* PURPOSE:
* This program generates a piece of art using loops which draw primitive shapes
* in a circle around the canvas. The image drawn can be altered by adjusting the 
* variables below. Additionally, the parameters can be shuffled by setting RANDOMIZE
* to true.
*/

private static int      SHAPE                     = 0;        // Set the shape (Ellipse = 0, Square = 1, Triangle = 2)
private static int      DISPLAY_WIDTH             = 5000;     // Set the display width
private static int      DISPLAY_HEIGHT            = 5000;     // Set the display height
private static int      SHAPE_WIDTH               = 150;      // Set the width of each individual shape
private static int      SHAPE_HEIGHT              = 150;      // Set the height of each individual shape
private static int      STARTING_DISTANCE         = 250;      // Set the distance the first shape will be from the center
private static int      WIDTH_INCREMENT           = 25;       // Set the amount the width increases per rotation
private static int      HEIGHT_INCREMENT          = 25;       // Set the amount the height increases per rotation
private static float    ANGLE_INCREMENT           = 8;        // Set the amount the angle increases per cycle
private static float    DISTANCE_MULTIPLIER       = 1.1;      // Set the multipler for the distance per cycle
private static boolean  RANDOMIZE                 = false;    // Set to true to randomize variables above

private float distance, width, height, angle;
private PGraphics background, mask;

public void settings() {
  // Set window size
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

public void setup() {
  // Setup layers
  background = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT);
  mask = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT);
  
  // Set paint parameters
  background(0);
  noLoop();
  
  
  // Set loop parameters
  width = SHAPE_WIDTH;
  height = SHAPE_HEIGHT;
  distance = STARTING_DISTANCE;
  angle = 0;
  
  // Check if parameters are to be randomized
  if (RANDOMIZE) {
    // Randomize parameters
    SHAPE               = (int) random(0, 3);
    WIDTH_INCREMENT     = (int) random(0, 200);
    HEIGHT_INCREMENT    = (int) random(0, 200);
    ANGLE_INCREMENT     = random(1, 45);
    DISTANCE_MULTIPLIER = random(1, 1.5);
    SHAPE_WIDTH         = (int) random(50, 300);
    SHAPE_HEIGHT        = (int) random(50, 300);
  }
}

public void draw() {
  background.beginDraw();
  background.stroke(255);
  background.noFill();
  background.background(0);
  while (distance < DISPLAY_WIDTH + 1000) {
    // Check if full rotation has occured
    if (angle % 360 == 0) { 
      distance  = distance * DISTANCE_MULTIPLIER;
      width += WIDTH_INCREMENT;
      height += HEIGHT_INCREMENT;
    }
    
    // Translate to center
    background.translate(DISPLAY_WIDTH/2, (DISPLAY_HEIGHT/2));
    
    // Rotate by angle
    background.rotate(radians(angle));
    
    // If ellipse
    if (SHAPE == 0) {
      background.ellipse(distance, 0, width, height);
    }
    // If square
    if (SHAPE == 1) {
      background.square(distance, 0, width);
    }
    // if triangle 
    if (SHAPE == 2) {
      background.triangle(distance, 0, distance - (width/2), height/2, distance - (width/2), -height/2);
    }

    // Fix rotation
    background.rotate(-radians(angle));
    
    // Fix translation
    background.translate(-DISPLAY_WIDTH/2, -DISPLAY_HEIGHT/2);
    
    // Increment angle
    angle += ANGLE_INCREMENT;
  }
  background.endDraw();
  
  // Create black mask
  mask.beginDraw();
  mask.background(0);
  
  // Fist cutout
  mask.rect(DISPLAY_WIDTH/10,
       DISPLAY_HEIGHT/9,
       DISPLAY_WIDTH - (DISPLAY_WIDTH/5),
       DISPLAY_HEIGHT/9);
  
  // Second cutout
  mask.rect(DISPLAY_WIDTH/10,
       3 * DISPLAY_HEIGHT/9,
       DISPLAY_WIDTH - (DISPLAY_WIDTH/5),
       DISPLAY_HEIGHT/9);
  
  // Third cutout
  mask.rect(DISPLAY_WIDTH/10,
       5 * DISPLAY_HEIGHT/9,
       DISPLAY_WIDTH - (DISPLAY_WIDTH/5),
       DISPLAY_HEIGHT/9);
  
  // Fourth cutout
  mask.rect(DISPLAY_WIDTH/10,
       7 * DISPLAY_HEIGHT/9,
       DISPLAY_WIDTH - (DISPLAY_WIDTH/5),
       DISPLAY_HEIGHT/9);
  
  mask.endDraw();
  background.mask(mask);
  image(background, 0, 0);
  
  
  // Create white mask
  fill(255);
  noStroke();
  
  // Left column
  rect(0, 0, DISPLAY_WIDTH/10 - DISPLAY_WIDTH/75, DISPLAY_HEIGHT);
  
  // Right column
  rect(DISPLAY_WIDTH - (DISPLAY_WIDTH/10 - DISPLAY_WIDTH/75), 0, DISPLAY_WIDTH/10 - DISPLAY_WIDTH/75, DISPLAY_HEIGHT);
  
  // first rectangle
  rect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT/9 - DISPLAY_HEIGHT/75);
  
  // Second rectangle
  rect(0, (3 * DISPLAY_HEIGHT/9) - DISPLAY_HEIGHT/75, DISPLAY_WIDTH, DISPLAY_HEIGHT/9 - DISPLAY_HEIGHT/75);
  
  // Third rectangle
  rect(0, DISPLAY_HEIGHT - (DISPLAY_HEIGHT/9 - DISPLAY_HEIGHT/75), DISPLAY_WIDTH, DISPLAY_HEIGHT/9 - DISPLAY_HEIGHT/75);
 
  // Save image
  save("artwork.png");
}
