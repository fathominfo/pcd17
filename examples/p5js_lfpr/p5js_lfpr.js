"use strict";

var femaleColor = '#ff6d1a';
var maleColor = '#14babd';

var femaleData;
var maleData;
var countries;
var currentYear = '1995';

// this will be the edge of the visualization
var bounds = { };

// where we will store all the data once we have combined the 
// country names, the labor force participation rate (lfpr) data  
// for women and men
var combined;
var count;


var mousedIndex = -1;

function preload() {
  countries = loadJSON('data/countries.json');
  femaleData = loadJSON('data/LFSFFE15.json');
  maleData = loadJSON('data/LFSFMA15.json');
}


function setup() {
  createCanvas(960, 540);
  ellipseMode(RADIUS);
  
  bounds.left = 50;
  bounds.right = width - bounds.left;
  bounds.top = 75;
  bounds.bottom = height - 75;
  
  removeIncompleteCountries(femaleData);
  removeIncompleteCountries(maleData);
  
  var fd;
  var md;
  var code;
  var country;
  
  combined = [];
  

  // here is where we merge our list of countries 
  // with the data for women in all countries and years
  // and the data for men in all countries and years
  for (code in countries) {
    fd = femaleData[code];
    md = maleData[code];
    // don't use this country if we are missing data for it
    if (fd && md) {
      country  = new CountryData(code, countries[code], fd, md);
      combined.push(country);
      country.setYear(currentYear);
    }
  } 
  
  // how many countries did we end up with?
  count = combined.length;

  // put the countries in the order we want to see first
  combined.sort(byGap);

  // place the countries on the canvas where we want them to start
  var i;
  var country;
  // start in the vertical center
  var midY = bounds.top + (bounds.bottom - bounds.top) /2;
  for (i = 0; i < count; i++) {
    country = combined[i];
    // the map function is very useful. Check it out at 
    // https://p5js.org/reference/#/p5/map
    var x = map(i, 0, count-1, bounds.left, bounds.right);
    country.setPosition(x, midY);
  }

  // create the buttons for sorting
  var buttonFemale = createDiv("sort by women LFPR");
  var buttonMale = createDiv("sort by men LFPR");
  var buttonGap = createDiv("sort by gap");
  

  // connect each button to the code you want to execute
  buttonFemale.mouseClicked(function() {
    combined.sort(byFemaleLFPR);
    moveToSortPosition()
    loop();
  });
 
  buttonMale.mouseClicked(function() {
    combined.sort(byMaleLFPR);
    moveToSortPosition()
    loop();
  });

  buttonGap.mouseClicked(function() {
    combined.sort(byGap);
    moveToSortPosition()
    loop();
  });
  
  // add the class that will set our CSS styles
  buttonFemale.addClass('button');
  buttonMale.addClass('button');
  buttonGap.addClass('button');

  // create a div to hold the buttons
  var buttonContainer = createDiv('');
  buttonContainer.child(buttonFemale);
  buttonContainer.child(buttonMale);
  buttonContainer.child(buttonGap);
}



// once the countries have been sorted, move them 
// to where they should go
function moveToSortPosition(){
  var i;
  for (i = 0; i < count; i++) {
    combined[i].moveTo(map(i, 0, count-1, bounds.left, bounds.right));
  }
}



// remove countries that have missing data
function removeIncompleteCountries(sourceData) {
  for (var countryCode in countries) { 
    if (missingData(sourceData, countryCode)) {
      print('Removing ' + countries[countryCode] + ' due to missing data');
      delete countries[countryCode];
    }
  }
}


function missingData(sourceData, countryCode) {
  // is there any data at all for this country?
  if (!(countryCode in sourceData)) {
    return true;
  }  
  var countryData = sourceData[countryCode];
  // now check whether each year is available for this country
  for (var yr = 1995; yr <= 2012; yr++) {
    if (!(yr in countryData)) {
      return true;
    }
  }
  // no missing data
  return false;
}



// Sorting functions. 
// Sorting relies on comparing two countries at a time,
// and you can choose what elements you want to sort by. 
// The compare function needs to return a number.
// If the number is less than 0, country1 will come first in the list
// If the number is greater than 0, country2 will come first in the list
// if the number is zero, there's no telling what happens.

// Here we try to sort by the gap. If the gap is the same, sort by the female value. 
function byGap(country1, country2) {
  var result = country1.gap - country2.gap;
  if (0 == result) {
    result = country1.femaleValue - country2.femaleValue;
  }  
  return result;
}

// Here we try to sort by the female value. If that is the same, sort by the gap. 
function byFemaleLFPR(country1, country2) {
  var result = country1.femaleValue - country2.femaleValue;
  if (0 == result) {
    result = country1.gap - country2.gap;
  }
  return result;
}

// Here we try to sort by the male value. If that is the same, sort by the gap. 
function byMaleLFPR(country1, country2) {
  var result = country1.maleValue - country2.maleValue;
  if (0 == result) {
    result = country1.gap - country2.gap;
  }
  return result;
}

// instead of doing the math, this one uses a javascript built in
// to compare the names.
function byName(country1, country2) {
  return country1.name.localeCompare(country2.name);
}





function draw() {
  background('#2e5f7f');
  
  strokeWeight(1);
  stroke(255, 128);
  var country;
  for (var i = 0; i < count; i++) {
    country = combined[i];
    country.update();
    if (i == mousedIndex) {
      fill(255);
      text(country.name, country.x.value, bounds.bottom - 25);
      stroke(255);
      country.draw(); 
    } else {
      stroke(255, 128);
      country.draw();
    }
    
  }
}




function mouseMoved(){
  var index = -1;
  if (mouseX < bounds.left) {
    // if we are off to the left, but still close enough to the left-most country, 
    // use it
    if (mouseX >= bounds.left - 25) {
      index = 0;
    }
  } else if (mouseX < bounds.left) {
    // if we are off to the right, but still close enough to the right-most country, 
    // use it
    if (mouseX <= bounds.right + 25) {
      index = count-1;
    }
  } else {
    index = round(map(mouseX,bounds.left, bounds.right,0, count-1));
  }
  if (index != mousedIndex) {
    mousedIndex = index;
  }
}



// A Softfloat is basically an updatable number. We use it here 
// to animate the positions of the different lines. 
function SoftFloat(value) {

    this.value = value || 0;
    this.attraction = .2;
    this.damping = .5;
    this.epsilon = .001;

    this.velocity = 0;
    this.acceleration = 0;

    this.atTarget = true;
    this.callback = false;
    this.target = this.value;
    
    this.update = function() {
      if (!this.atTarget) {
        this.acceleration += this.attraction * (this.target - this.value);
        this.velocity = (this.velocity + this.acceleration) * this.damping;
        this.value += this.velocity;
        this.acceleration = 0;
        if (abs(this.velocity) > this.epsilon && abs(this.value - this.target) > this.epsilon) {
          // we are still updating
          return true;
        }
        this.value = this.target;
        this.atTarget = true;
        if (this.callback){
          this.callback();
        }
      }
      return false;
    };


  this.setTarget = function(t) {
    this.atTarget = false;
    this.target = t;
  }
}



// CountryData holds the data for a specific country
// and also tracks its current location 
function CountryData(code, name, femaleData, maleData) {
  this.code = code;
  this.name = name;
  this.femaleData = femaleData;
  this.maleData = maleData;
  
  
  
  this.setYear = function(yr) {
    this.femaleValue = this.femaleData[yr];
    this.maleValue = this.maleData[yr]; 
    this.gap = this.femaleValue - this.maleValue;
  }
  
  // set the position we are going to start from
  this.setPosition = function(x, y){
    this.x = new SoftFloat(x);
    this.fy = new SoftFloat(y);
    this.my = new SoftFloat(y);
    var fy = map(this.femaleValue, 0, 100, bounds.bottom, bounds.top);
    var my = map(this.maleValue, 0, 100, bounds.bottom, bounds.top);
    this.fy.setTarget(fy); 
    this.my.setTarget(my);
  }
  
  this.moveTo = function(x) {
    this.x.setTarget(x);
  }
  
  this.update = function(){
    this.x.update();
    this.fy.update(); 
    this.my.update();
  } 
  
  
  // when we draw a country, we draw the line from the female to the male value  
  this.draw = function(yr) {
    var x = this.x.value;
    var fy = this.fy.value;
    var my = this.my.value;
    line(x, fy, x, my);
    noStroke();
    fill(femaleColor);
    ellipse(x,fy,2,2);
    fill(maleColor);
    ellipse(x,my,2,2);
  }

}


