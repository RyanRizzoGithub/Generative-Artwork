/**
* AUTHOR:
* Ryan Rizzo
*
* FILE:
* PathFinder.pde
* 
* DATE:
* 12/25/22
*
* PURPOSE:
* This program generates a piece of art using indivudual lines which
* which look for a coordinate they have not visited
*/

import java.util.*;

private static final int DISPLAY_WIDTH = 5000;               // Set image width here  
private static final int DISPLAY_HEIGHT = 5000;              // Set image height here
private static final int[] palette = {#001219, #005f73, #0a9396, #94d2bd, #e9d8a6,
                                      #ee9b00, #ca6702, #bb3e03, #ae2012, #9b2226};


public void settings() {
  // Set window size
  size(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

public void setup() {
  // Set paint parameters
  noLoop();
}

public void draw() {
  // Set background color
  background(palette[0]);
  
  // For each line created
  for (int i=0; i<30; i++) {
    // Chose random stroke color from palette
    stroke(palette[(int) random(1, 10)]);
    strokeWeight(5);
    
    // Create set to track locations visited by the line
    HashSet<int[]> verticesVisited = new HashSet<int[]>();
    
    // Setup start poisition
    int startX = ((int) random(0, DISPLAY_WIDTH));
    int startY = ((int) random(0, DISPLAY_HEIGHT));
    int newX = 0;
    int newY = 0;
    int incrementDis = DISPLAY_WIDTH/20;
    verticesVisited.add(new int[] {startX, startY});
    
    // For each direction decision by line
    for (int j=0; j<1000; j++) {
      // Choose the direction
      int direction = (int) random(0, 4);
      
      // If NORTH
      if (direction == 0) {
        newX = startX;
        newY = startY - incrementDis;
      }
      // If EAST
      if (direction == 1) {
        newX = startX + incrementDis;
        newY = startY;
      }
      // If SOUTH
      if (direction == 2) {
        newX = startX;
        newY = startY + incrementDis;
      }
      
      // If WEST
      if (direction == 3) {
        newX = startX - incrementDis;
        newY = startY;
      }
      
      // Check if new location has been visited
      boolean visited = false;
      for (int[] currV: verticesVisited) {
        if (currV[0] == newX && currV[1] == newY) {
          visited = true;
        }
      }
      
      // If location is empty, draw line and update info
      if (!visited) {
        line(startX, startY, newX, newY);
        int[] move = {newX, newY};
        verticesVisited.add(move);
        startX = newX;
        startY = newY;
      }
    }
  }
}
