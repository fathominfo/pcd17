

function setup() {
  httpGet("map.svg",'svg','false',addSVG);    
}

function addSVG(response){
  var mySVG = createElement('div');
  mySVG.position(0, 0);
  var myCanvas = createCanvas();
  myCanvas.position(0, 0);
  myCanvas.size(mySVG.size().width, mySVG.size().height);
  mySVG.elt.append(response.responseXML.documentElement);
  var buttons = selectAll('.state');
  
  buttons.forEach(function(button, idx, array) {
    button.mouseClicked(function() {
      print(this.id() + " clicked");
    });
  });
}  


function draw() {
  // nothing to do here for now.
  noLoop();
}