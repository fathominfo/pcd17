"use strict";

var femaleColor = '#ff6d1a';
var maleColor = '#14babd';

var femaleData;
var maleData;
var countries;
var currentYear = '1995';

var bounds = { };


var combined;
var count;

var mousedIndex = -1;



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
}

SoftFloat.prototype.update = function() {
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
}


SoftFloat.prototype.setTarget = function(t) {
  this.atTarget = false;
  this.target = t;
}

function CountryData(code, name, female, male) {
  this.code = code;
  this.name = name;
  this.femaleData = female;
  this.maleData = male;
  if ('Mozambique' == name) {
    print(female, male);
  } 
}

CountryData.prototype.setPosition = function(x, y){
  this.x = new SoftFloat(x);
  this.fy = new SoftFloat(y);
  this.my = new SoftFloat(y);
}

CountryData.prototype.moveTo = function(x) {
  this.x.setTarget(x);
}

CountryData.prototype.setYear = function(yr) {
  this.female = this.femaleData[yr];
  this.male = this.maleData[yr];
  var fy = map(this.female, 0, 100, bounds.bottom, bounds.top);
  var my = map(this.male, 0, 100, bounds.bottom, bounds.top);
  this.fy.setTarget(fy); 
  this.my.setTarget(my);
  this.gap = this.female - this.male;
}

CountryData.prototype.update = function(){
  this.x.update();
  this.fy.update(); 
  this.my.update();
} 


CountryData.prototype.draw = function(yr) {
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
  
  combined = [];
  
  for (code in countries) {
    fd = femaleData[code];
    md = maleData[code];
    if (fd && md) {
      combined.push(new CountryData(code, countries[code], fd, md));
    }
  } 
  
  
  count = combined.length;
  
  combined.sort(byGap);
  
  var buttonFemale = createDiv("sort by women LFPR");
  buttonFemale.mouseClicked(function() {
    combined.sort(byFemaleLFPR);
    moveToSortPosition()
    loop();
  });

  var buttonMale = createDiv("sort by men LFPR");
  buttonMale.mouseClicked(function() {
    combined.sort(byMaleLFPR);
    moveToSortPosition()
    loop();
  });

  var buttonGap = createDiv("sort by gap");
  buttonGap.mouseClicked(function() {
    combined.sort(byGap);
    moveToSortPosition()
    loop();
  });
  
  buttonFemale.addClass('button');
  buttonMale.addClass('button');
  buttonGap.addClass('button');


  var i;
  var country;
  var midY = bounds.top + (bounds.bottom - bounds.top) /2;
  for (i = 0; i < count; i++) {
    country = combined[i];
    var x = map(i, 0, count-1, bounds.left, bounds.right);
    country.setPosition(x, midY);
    country.setYear(currentYear);
  }

}

function moveToSortPosition(){
  var i;
  for (i = 0; i < count; i++) {
    combined[i].moveTo(map(i,0, count-1, bounds.left, bounds.right));
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


function byName(a, b) {
  return a.name.localeCompare(b.name);
}

function byGap(a, b) {
  var result = a.gap - b.gap;
  if (0 == result) {
    result = a.female - b.female;
  }
  return result;
}

function byFemaleLFPR(a, b) {
  var result = a.female - b.female;
  if (0 == result) {
    result = a.gap - b.gap;
  }
  return result;
}

function byMaleLFPR(a, b) {
  var result = a.male - b.male;
  if (0 == result) {
    result = a.gap - b.gap;
  }
  return result;
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
  //noLoop();
}


function mouseMoved(){
  var index = -1;
  if (mouseX < bounds.left) {
    if (mouseX >= bounds.left - 25) {
      index = 0;
    }
  } else if (mouseX < bounds.left) {
    if (mouseX <= bounds.right + 25) {
      index = count-1;
    }
  } else {
    index = round(map(mouseX,bounds.left, bounds.right,0, count-1));
  }
  if (index != mousedIndex) {
    mousedIndex = index;
    loop();
  }
}


