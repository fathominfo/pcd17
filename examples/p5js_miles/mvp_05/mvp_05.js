// we can check this flag to see if the data is loaded
var loaded = false;

// this will hold the data
var sessions;

// since we will drawing the timeline many times, we can save 
// some calculation by setting the x positions just once
var sessionX;

// we will always have one entry in the timeline selected
var selectedIndex = 0;


// New!
// we will track how many sessions each person played on
// and draw them as circles
var musicianRadii;
var minRadius = 2;
var maxRadius = 12;



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
  ellipseMode(RADIUS);
  stroke(255);
  fill(255);
  smooth();
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
  for (var i=0, L = sessions.length; i<L;i++){
    x = sessionX[i];
    line(x,100,x,110);
  }
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
  
  var personnel = sessions[selectedIndex].personnel;
  var ypos = 130;
  // New!
  // the personnel list doesn't ju
  var artist;
  var name;
  var radius;
  textAlign(LEFT,CENTER);
  for (var i=0,L=personnel.length;i<L;i++){
    // New!
    artist = personnel[i];
    name = artist.name;
    radius = artist.radius;
    ypos += max(radius, 8);
    ellipse(x,ypos,radius,radius);
    text(name,x + maxRadius + 5,ypos);
    ypos += radius + 5;
  }
  
  
  noLoop();
  
}


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
  
  
  // New!
  // track how many sessions each musician played
  var musicianCounts = {};
  var maxCount = 0;
  var names;
  var name;
  
  // now that we know the min and max, we can calculate the x positions
  sessionX = [];
  var x;
  for (var i=0,L=sessions.length;i<L;i++){
    d = sessions[i].date;
    x = map(d, minDate, maxDate, leftEdge, rightEdge);
    sessionX[i] = x;
    // New!
    names = sessions[i].personnel;  
    for (var j=0,L2 = names.length;j<L2;j++){
      name = names[j];
      // is this person tracked yet?
      if (undefined === musicianCounts[name]) {
        musicianCounts[name] = 1;
      } else {
        musicianCounts[name]++;
        if (musicianCounts[name]>maxCount && name != "Miles Davis"){
          maxCount = musicianCounts[name];
        }
      }
    }
  }
  
  // now that we know the max count, we can calculate sizes for musicians
  musicianRadii = {};
  var minArea = PI * minRadius * minRadius;
  var maxArea = PI * maxRadius * maxRadius;
  var area;
  var radius;
  for (var name in musicianCounts) {
    area = map(musicianCounts[name],1,maxCount,minArea,maxArea);
    radius = sqrt(area/PI);
    musicianRadii[name] = radius;
  }
  musicianRadii['Miles Davis'] = 3; // he's special
  
  
  
  // now replace the list of names for each session
  // with a list of names and sizes
  var names;
  var personnel;
  for (var i=0,L=sessions.length;i<L;i++){
    names = sessions[i].personnel;
    personnel = [];
    for (var j=0,L2 = names.length;j<L2;j++){
      name = names[j];
      radius = musicianRadii[name];
      personnel.push({name:name,radius:radius});
    }
    // now sort the list
    personnel.sort(sortPersonnel);
    sessions[i].personnel = personnel;
    
  }
  
}


function sortPersonnel(a,b){
  if (a.name == 'Miles Davis') {
    return -1;
  }
  if (b.name == 'Miles Davis') {
    return 1;
  }
  if(a.radius < b.radius) {
    return 1;
  }
  if(a.radius > b.radius) {
    return -1;
  }
  return 0;
}