import processing.pdf.*;

import java.util.*;

JSONArray quakes;
JSONArray small_quakes;
JSONObject quakes_object;
JSONObject small_quakes_object;
float margin_x;
float margin_y;
float x;
float y;
float x_start;
float y_start;

// start and end dates in milliseconds (pulled manually from data)
long START_DATE_MS = 1401595200L;
long END_DATE_MS = 1433217600L;

Quake[] quakes_array;

void settings() {
  size(4320, 3456, PDF, "output2.pdf");
}

void setup() {
  margin_x = 50;
  margin_y = 50;

  quakes_object = loadJSONObject("data/4.5.plus.json");
  small_quakes_object = loadJSONObject("data/3.0-4.49.plus.json");
  quakes = quakes_object.getJSONArray("features");
  small_quakes = small_quakes_object.getJSONArray("features");

  y_start = margin_y;
  x_start = margin_x;
  noLoop();

  quakes_array = new Quake[quakes.size() + small_quakes.size()];

  int index = 0;

  // iterate through small quakes file
  for (int q = 0; q < small_quakes.size(); q++) {
    JSONObject quake = small_quakes.getJSONObject(q);
    float mag = quake.getJSONObject("properties").getFloat("mag");
    long ms = quake.getJSONObject("properties").getLong("time");
    Quake newQuake = new Quake(mag, ms);
    if (quake.getJSONObject("properties").getFloat("tsunami") == 1) {
      newQuake.setTsu(true);
    }
    quakes_array[index++] = newQuake;
  }

  // iterate through big quakes file
  for (int q = 0; q < quakes.size(); q++) {
    JSONObject quake = quakes.getJSONObject(q);
    float mag = quake.getJSONObject("properties").getFloat("mag");
    long ms = quake.getJSONObject("properties").getLong("time");
    Quake newQuake = new Quake(mag, ms);
    if (quake.getJSONObject("properties").getFloat("tsunami") == 1) {
      newQuake.setTsu(true);
    }
    quakes_array[index++] = newQuake;
  }


  // Set positions of quakes
  x = x_start;
  y = y_start;

  for (float m = 3.0f; m <= 10; m += 0.1) {
    float mag = 0;
    for (Quake quake : quakes_array) {
      if (quake.getMag() >= m && quake.getMag() < m+0.1) {
        x = map((float)quake.dateMS(), (float)START_DATE_MS, (float)END_DATE_MS, margin_x, 4320-margin_x); // set x position based on date
        quake.setCoords(x, y);
        mag = quake.getMag();
      }
    }
    y += 10 + pow(1.52f, mag*1.5f)*2;  // set y position based on magnitude
  }
}

public void draw() {
  background(255);

  stroke(0, 30);

  y = y_start;
  stroke(23, 58, 170);
  for (Quake quake : quakes_array) {
    quake.display();
  }
  exit();
}