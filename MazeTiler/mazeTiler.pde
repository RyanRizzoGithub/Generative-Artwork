/**
* AUTHOR:
* Ryan Rizzo
*
* FILE:
* MazeTiler.pde
* 
* DATE:
* 12/25/22
*
* PURPOSE:
* This program generates a piece of art using a tile system with
* randomly generated lines and diamonds. 
*/

private static final int DISPLAY_WIDTH = 5000;                    // Set image width here
private static final int DISPLAY_HEIGHT = 5000;                   // Set image height here
private static final int TILE_NUM_X = 25;                         // Set # horizontal tiles here
private static final int TILE_NUM_Y = 25;                         // Set # vertical tiles here
private static final int[] colors = {#FF0000, #FFFF00, #0000FF};  

public void settings() {
   // Set window size 
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

public void setup() {
  // Set paint parameters
  background(#FFFFFF);
  stroke(0);
  strokeWeight(25);
  noLoop();
}

public void draw() {
  // Draw each diamond randomly using tile class
  for (int i=0; i < TILE_NUM_X; i++) {
    for (int j=0; j < TILE_NUM_Y; j++) {
      int width = DISPLAY_WIDTH / TILE_NUM_X;
      int height = DISPLAY_HEIGHT / TILE_NUM_Y;
      Tile tile = new Tile(i * width, j * height, width, height);
      tile.generateDiamonds();
    }
  }
  // Draw each line randomly using tile class
  for (int i=0; i < TILE_NUM_X; i++) {
    for (int j=0; j < TILE_NUM_Y; j++) {
      int width = DISPLAY_WIDTH / TILE_NUM_X;
      int height = DISPLAY_HEIGHT / TILE_NUM_Y;
      Tile tile = new Tile(i * width, j * height, width, height);
      tile.generateLines();
    }
  }
  // Save the image
  save("tile.png");
}

public class Tile {
  private int x, y, width, height;
  
  // Constructor
  public Tile(int x, int y, int width, int height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  // Generate each diagonal line
  public void generateLines() {
    // 50% chance of line from center to top left
    if ((int) random(2) == 0) {
      line(x, y, x + (width / 2), y + (height / 2));
    }
    // 50% chance of line from center to top right
    if ((int) random(2) == 0) {
      line(x + width, y, x + (width / 2), y + (height / 2));
    }
    // 50% chance of line from center to bottom right
    if ((int) random(2) == 0) {
      line(x + width, y + height, x + (width / 2), y + (height / 2));
    }
    // 50% chance of line from center to bottom left
    if ((int) random(2) == 0) {
      line(x, y + height, x + (width / 2), y + (height / 2));
    }
  }
  
  // Generate each color diamond
  public void generateDiamonds() {
    // Randomly select primary color
    fill(colors[(int) random(3)]);
    
    // 10% chance of diamond being drawn
    if ((int) random(10) == 0) {
      // Draw the diamond
      beginShape();
      vertex(x, y);
      vertex(x + (width / 2), y + (height / 2));
      vertex(x + width, y);
      vertex(x + (width / 2), y - (height / 2));
      vertex(x, y);
      endShape();
    }
  }
}
