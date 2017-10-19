// we can check this flag to see if the data is loaded
var loaded = false;

// this will hold the data
var sessions;

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
  loadJSON("data/sessions.json", dataLoaded);
}

function draw() {
  background(60, 63, 108);
  fill(255);

  // if the data ain't loaded, don't try to draw it
  if (sessions) {
    drawSessions();
    
  } else {
    textAlign(CENTER, CENTER);
    text("Loading " + frameCount, width/2, height/2);
  }
}


function drawSessions() {
  stroke(255);
  var d, x;
  for (var i=0, L = sessions.length; i<L;i++){
    d = sessions[i].date;
    x = map(d,minDate,maxDate,leftEdge,rightEdge);
    line(x,100,x,110);
  }
  noStroke();
  textAlign(LEFT, TOP);
  text("Sessions", 40, 99);
  noLoop();
  
}


function dataLoaded(data){
  // keep track of the sessions
  sessions = data;
  // set the min date to a value higher than anything in our data
  minDate = sessions[0].date;
  maxDate = sessions[1].date;
  var i, d;
  for (i = 1; i < sessions.length; i++) {
    d = sessions[i].date;
    if (d < minDate) {
      minDate = d;
    }
    if (d > maxDate) {
      maxDate = d;
    }
  }
}