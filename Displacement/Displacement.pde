/**
* AUTHOR:
* Ryan Rizzo
* 
* FILE:
* Displacement.pde
* 
* DATE:
* 12/25/22
* 
* PURPOSE: This program generates a piece of art using rectangles with randomized
* displacement, size, color, and opacity. Texture is added to some 
* rectangles using circle noise.
*/

private static final int DISPLAY_WIDTH = 5000;      // Set image width here
private static final int DISPLAY_HEIGHT = 5000;     // Set image height here
private static final int RECT_NUM_X = 25;           // Set # of horizontal rectangles here
private static final int RECT_NUM_Y = 25;           // Set # of vertical rectangles here
private static final int[] palette = {#2d3142, #bfc0c0, #ffffff, #ef8354, #4f5d75};
private PGraphics background;

public void settings() {
  // Set window size
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

public void setup() {
  // Create layer and set draw parameters
  background = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT);
  noLoop();
}

public void draw() {
  // Set the background color
  background(palette[0]);
  
  // Loop over each row and column
  background.beginDraw();
  for (int i=0; i<RECT_NUM_X; i++) {
    for (int j=0; j<RECT_NUM_Y; j++) {
      
      // Set the fill color using random index in palette
      background.fill(palette[(int) random(1, 5)],(int) random(100, 255));
      
      // Calculate x coordinate with random offset
      int xPos = (int) (i * (DISPLAY_WIDTH/RECT_NUM_X) + random(-DISPLAY_WIDTH/50, DISPLAY_WIDTH/50));
     
      // Calculate y coordinate with random offset
      int yPos = (int) (j * (DISPLAY_HEIGHT/RECT_NUM_Y) + random(-DISPLAY_HEIGHT/50, DISPLAY_HEIGHT/50));
      
      // Calculate width with random offset
      int recWidth = (int) ((DISPLAY_WIDTH/RECT_NUM_X) + random(-DISPLAY_WIDTH/50, DISPLAY_WIDTH/50));
      
      // Calculate height with random offset
      int recHeight = (int) ((DISPLAY_HEIGHT/RECT_NUM_Y) + random(-DISPLAY_HEIGHT/50, DISPLAY_HEIGHT/50));
      
      // Draw the rectangle
      background.rect(xPos, yPos, recWidth, recHeight);
      
      // Set fill color for texture
      background.fill(0, (int) random(75, 200));
      
      // Calculate dot width with random offset
      int dotWidth = (int) random(1, recWidth/10);
      
      // Calculate dot height with random offset
      int dotHeight = (int) random(1, recHeight/10);
      
      // Iterate over the bounds of previous rectangle
      for (int k=0; k<recWidth; k++) {
        for (int m=0; m<recHeight; m++) {
          // Draw circle 
          if ((int) random(10) == 0) {
            ellipse(xPos + k, yPos + m, dotWidth, dotHeight);
          }
        }
      }
    }
  }
  background.endDraw();
  
  // Load the layer onto the canavs
  image(background, 0, 0);
  
  // Save the image
  save("artwork.png");
}
