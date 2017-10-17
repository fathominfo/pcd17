var t;  // table of locations and zip codes
var placeList = [];  // make an array called 'places'

// boundaries of the points
var minX, minY, maxX, maxY;


function preload() {
  t = loadTable("data/zips.tsv", "header", "tsv");
}


function setup() {
  createCanvas(719, 452);
  
  for (var row = 0; row < t.getRowCount(); row++) {
    var place = { };
    //print(row);
    //print(t.getRow(row));
    place.lat = t.getNum(row, "lat");
    place.lon = t.getNum(row, "lon");
    place.name = t.getString(row, "name");
    place.zip = t.getString(row, "zip");
    
    // now calculate specific location
    var projected = projectAlbers(place.lon, place.lat);
    // or you can use the Mercator version:
    //var projected = projectMercator(place.lon, place.lat);
    place.x = projected.x;
    place.y = projected.y;
    placeList.push(place);
  }
  // print out how many points were found
  //print(placeList.length);
  
  findMinMax();
}


// figure minimum and maximum values for the x- and y-coordinates
function findMinMax() {
  // start by setting the min/max to the first point in the list
  minX = maxX = placeList[0].x;
  minY = maxY = placeList[0].y;
  // then check each of the other points in the list
  for (var i = 1; i < placeList.length; i++) {
    var place = placeList[i];
    if (place.x > maxX) {
      maxX = place.x;
    }
    if (place.x < minX) {
      minX = place.x;
    }
    if (place.y > maxY) {
      maxY = place.y;
    }
    if (place.y < minY) {
      minY = place.y;
    }
  }
  //print(maxX - minX);  // 0.7187
  //print(maxY - minY);  // 0.4522
}


function draw() {
  for (var i = 0; i < placeList.length; i++) {
    var place = placeList[i];
    var x = map(place.x, minX, maxX, 0, width);
    var y = map(place.y, maxY, minY, 0, height);
    point(x, y);
  }
}


// Albers equal-area conic projection   
function projectAlbers(lon, lat) {
  // USGS uses standard parallels at 45.5°N and 29.5°N
  // With a central meridian value of 96°W
  // Latitude value is phi, longitude is lambda
  var phi0 = 0;
  var lambda0 = radians(-96);
  var phi1 = radians(29.5);
  var phi2 = radians(45.5);
    
  var phi = radians(lat);
  var lambda = radians(lon);

  var n = 0.5 * (sin(phi1) + sin(phi2));
  var theta = n * (lambda - lambda0); //radians(lon - lambda0);
  var c = sq(cos(phi1)) + 2*n*sin(phi1);
  var rho = sqrt(c - 2*n*sin(phi)) / n;
  var rho0 = sqrt(c - 2*n*sin(phi0)) / n;
 
  return { 'x': rho * sin(theta), 'y': rho0 - rho*cos(theta) };
}


// get the Mercator projection for a specific lat/lon coordinate
function projectMercator(lon, lat) {
  return { 
    'x': lon, 
    'y': degrees(log(tan(radians(lat)) + 1.0/cos(radians(lat)))) 
  };
}