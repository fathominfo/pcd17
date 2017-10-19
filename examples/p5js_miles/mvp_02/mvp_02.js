// we can check this flag to see if the data is loaded
var loaded = false;

// this will hold the data
var sessions;


// New!
// since we will drawing the timeline many times, we can save 
// some calculation by setting the x positions just once
var sessionX;

// New!
// we will always have one entry in the timeline selected
var selectedIndex = 0;


// we can plug these into the map() function
// to plot the timeline
var minDate;
var maxDate;
var leftEdge;
var rightEdge;

function setup() {
  createCanvas(1280, 720);
  
  leftEdge = 100;
  rightEdge = width - 100;
  
  // see the handleLoad function below for what we do with the data
  loadJSON("data/sessions.json", handleLoad);
  stroke(255);
  fill(255);
}

function draw() {
  background(60, 63, 108);
  // if the data ain't loaded, don't try to draw it
  if (!sessions) {
    text("Loading " + frameCount, width/2,height/2);
    return;
  }
  
  var x;
  stroke(255);
  for (var i=0; i<sessions.length; i++){
    x = sessionX[i];
    line(x,100,x,110);
  }
  
  // New!
  // Draw info for the selected session
  x = sessionX[selectedIndex];  
  line(x,70,x,100);
  var date = sessions[selectedIndex].dateString;
  var location = sessions[selectedIndex].location;

  noStroke();
  textAlign(LEFT, TOP);
  text("Sessions", 40, 99);
  textAlign(RIGHT, BOTTOM);
  text(date, x-6, 84);
  textAlign(LEFT, BOTTOM);
  text(location, x+6, 84);
  
  noLoop();
  
}

// New !
function mouseMoved() {
  // set this to be farther than any possible entry in the index    
  var closestDistance = width * 2;
  var distance;
  var x;
  
  // we will only check the x position
  for (var i=0, L = sessions.length; i<L;i++){
    x = sessionX[i];
    distance = abs(mouseX-x);
    if (distance<closestDistance) {
      closestDistance = distance;
      selectedIndex = i;
    }
  }
  loop();
}

function handleLoad(data){
  // keep track of the sessions
  sessions = data;
  
  // set the min date to a value higher than anything in our data
  minDate = Number.MAX_SAFE_INTEGER;
  maxDate = Number.MIN_SAFE_INTEGER;
  var d;
  for (var i=0,L=sessions.length;i<L;i++){
    d = sessions[i].date;
    if (d<minDate) {minDate = d;}
    if (d>maxDate) {maxDate = d;}
  }
  
  
  // now that we know the min and max, we can calculate the x positions
  sessionX = [];
  var x;
  for (var i=0,L=sessions.length;i<L;i++){
    d = sessions[i].date;
    x = map(d, minDate, maxDate, leftEdge, rightEdge);
    sessionX[i] = x;
  }
}