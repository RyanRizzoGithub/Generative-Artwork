/**
* AUTHOR:
* Ryan Rizzo
* 
* FILE:
* Recursion.pde
* 
* DATE:
* 12/25/22
* 
* PURPOSE:
* This program generates a piece of art using a tile system. Each tile
* will occupy a random shape in each quadrent, or will create a new
* tile of half the size.
*/

private static final int DISPLAY_WIDTH = 5012;           // Set image width here (power of 2)
private static final int DISPLAY_HEIGHT = 5012;          // Set image height here (power of 3)
private static final int TILE_NUM_X = 4;                 // Set number of horizontal tiles here
private static final int TILE_NUM_Y = 4;                 // Set number of vertical tiles here
private static final int[] palette = {#D7D9CE, #0C7489, #13505B, #040404, #119DA4};      

private PGraphics background;


public void settings() {
  // Set window size
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

public void setup() {
  // Create layer
  background = createGraphics(DISPLAY_WIDTH, DISPLAY_HEIGHT);
  noLoop();
}

public void draw() {
  Tile tile;
  // For each horizontal cell
  for (int i=0; i < TILE_NUM_X; i++) {
    // For each vertical cell
    for (int j=0; j < TILE_NUM_Y; j++) {
      // Calculate width & height
      int width = DISPLAY_WIDTH / TILE_NUM_X;
      int height = DISPLAY_HEIGHT / TILE_NUM_Y;
      
      // Create the new tile, and draw it on background layer
      tile = new Tile(i * width, j * height, width, height, background);
      tile.generate();
      background = tile.getGraphics();
    }
  }
  // Display layer & save
  image(background, 0, 0);
  saveFrame("artwork.png");
}



public class Tile {
  private int x, y, width, height;
  private PGraphics g;
  
  // Constructor
  public Tile(int x, int y, int width, int height, PGraphics g) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.g = g;
  }
  
  public void generate() {
    // Setup paint parameters
    g.beginDraw();
    g.stroke(0);
    g.strokeWeight(5);
    g.fill(palette[(int) random(4)]);
    
    // Partition off the cell
    g.rect(x, y, this.width, this.height);
    
    // Insert random shape into each quadrent
    randomShape(x, y, this.width / 2, this.height / 2);
    randomShape(x + (this.width / 2), y, this.width / 2, this.height / 2);
    randomShape(x + (this.width / 2), y + (this.height / 2), this.width / 2, this.height / 2);
    randomShape(x, y + (this.height / 2), this.width / 2, this.height / 2);
    g.endDraw();
  }
  
  private void randomShape(int x, int y, int width, int height) {
    // Choose a random color
    g.fill(palette[(int) random(4)]);
    
    // Choose a random shape
    int shape = (int) random(8);
    
    // If RECTANGLE
    if (shape == 1) {
      g.rect(x + (width / 10), y + (height / 10), width - (width / 5), height - (height / 5));
    }
    
    // If ELLIPSE
    if (shape == 2) {
      g.ellipse(x + (width / 2), y + (height / 2), width - (width / 5), height - (height / 5));
    }
    
    // If TRIANGLE
    if (shape == 3) {
      g.beginShape();
      g.vertex(x + (width / 2), y + (height / 10));
      g.vertex(x + width - (width / 10), y + height - (height / 10));
      g.vertex(x + (width / 10), y + height - (height / 10));
      g.vertex(x + (width / 2), y + (height / 10));
      g.endShape();
    }
    
    // If SUB TILE
    if (shape >= 4 && width > 100 && height > 100) {
      Tile tile = new Tile(x, y, width, height, g);
      tile.generate();
    }
  }
  
  public PGraphics getGraphics() {
    return this.g;
  }
}
