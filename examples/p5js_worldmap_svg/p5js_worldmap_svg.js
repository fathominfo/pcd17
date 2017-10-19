// which indicator do we want to show? 
// you can use any indicator in the noceilings data repository at 
//   https://github.com/fathominfo/noceilings-data. 
// Once you have that downloaded, just drag a file from the json directory 
// into this sketch and change the name of the indicator below to match 
// the file name.
var indicatorName = 'GERSFEIN';

// Most indicators (not all) have many years of data. 
// We choose one to show in the map.
var indicatorYear = 2011;

// these variables are used in multiple places,
// so we declare them here 
var isoTable; 
var indicator;
var iso2Lookup;


var indicatorMin;
var indicatorMax;

function preload(){
  indicator = loadJSON("data/" + indicatorName + ".json");
  isoTable = loadTable("data/iso3-to-iso2.csv", "csv", "header");
}

function setup() {
  // the svg codes each country by a two letter code,
  // whereas the indicator data tracks each country 
  // by a three letter code. 
  // create a lookup from 3-letter to 2-letter;
  var rowCount = isoTable.getRowCount();
  var i;
  var iso3, iso2;
  iso2Lookup = {};
  for (i = 0; i < rowCount; i++) {
    iso3 = isoTable.getString(i, "iso3")
    iso2 = isoTable.getString(i, "iso2").toLowerCase();
    iso2Lookup[iso3] = iso2;
  }
  
  // p5.js doesn't currently provide a nice way of adding an svg 
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/world.svg');
  xhr.setRequestHeader('Content-Type', 'image/svg+xml');
  xhr.onload = function() {
    if (xhr.status === 200) {
        document.getElementsByTagName('body')[0].append(xhr.responseXML.documentElement)
        setMap();
    }
    else {
        println('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
}




function setMap() {
  
  // set the countries to a default of white
  clearColors();

  // find the limits of the data so that we can scale colors
  setMinMax();

  // color each country according to the data
  colorCountriesByData();

}




function clearColors() {
  var shapes = document.getElementsByTagName('path');
  var i;
  var L = shapes.length;    
  for (i = 0; i < L; i++) {
    shapes[i].setAttribute('fill', 'none');
  }
}



function setMinMax() {
  // Assume there is data for the USA in the year in question.
  // We can get fancy later if that assumption proves false 

  var iso3;
  var countryData;
  var value; 
  
  // set the min to something way too high
  // and the max to something way too low
  // based on a quick peek at the data
  indicatorMin = 10000;
  indicatorMax = -10000;

  // iterate through every country...
  for (iso3 in indicator) {
    countryData = indicator[iso3];
    // and get its value for the year in question
    value = countryData[indicatorYear];
    // to find the minimum and maximum values
    if (value < indicatorMin) {
      indicatorMin = value;
    } 
    if (value > indicatorMax) {
      indicatorMax = value;
    }
  }  
}





// color each country according to the data
function colorCountriesByData() {
  
  // color the countries according to the data for
  // the desired year.
  var countryData;
  var value;
  var iso3, iso2;
  var grayness;
  var rgb;
  var countrySvg;
  
  // now color every country according to the value for the selected year 
  for (iso3 in indicator) {
    countryData = indicator[iso3];
    value = countryData[indicatorYear];
    
    if (value !== undefined) {
      // the country will be darker with higher values of the indicator
      // the lowest number goes to white
      // and highest number goes to black
      grayness = round(map(value, indicatorMin, indicatorMax, 255, 0));
      
      // turn that into an rgb value 
      rgb = 'rgb(' + grayness + ',' + grayness + ',' + grayness + ')';
      
      // our data has iso3, and the svg map is coded by iso2 
      iso2 = iso2Lookup[iso3];
      
      // find the shape for this country code
      countrySvg = document.getElementById(iso2);
      
      // if the map does have a shape for this country
      if (null != countrySvg) {
        setCountryColor(countrySvg, rgb);
        bindClick(countrySvg,iso3, value);        
      } else {
        //Un-comment this if you'd like to know which countries are missing
        //print("could not find a country for " + iso3 + ", at least not with the code of " + iso2 + ".");
      }            
    } else {
      //Un-comment this if you'd like to know where there are gaps in the data
      //print("No data for", iso3, "in", indicatorYear);
    }
  }  
}




// what to do when the user clicks on a country.
function bindClick(element, iso3, value) {
  element.addEventListener('click', function(){
    print(iso3, value);
    alert('clicked ' + iso3 + " " + value);
  }, false);
}



// color a country  
function setCountryColor(element, fill) {
  // is this a shape we can color, or a collection of shapes?
  if ('g' == element.tagName) {
    // this is a collection, so try to color the elements
    // in the collection.
    var children = element.children; 
    var i;
    var L = children.length; 
    for (i = 0; i < L; i++) {
      setCountryColor(children[i], fill);
    }
  } else {
    element.setAttribute('fill', fill);
  }
}


function draw() {
  // all the work is done by coloring the svg, so no need to do anything here
  noLoop();
}