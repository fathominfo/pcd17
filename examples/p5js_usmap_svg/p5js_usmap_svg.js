

function setup() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'map.svg');
  xhr.setRequestHeader('Content-Type', 'image/svg+xml');
  xhr.onload = function() {
    if (xhr.status === 200) {
      addSVG(xhr.responseXML.documentElement)
    } else {
      println('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
}

function addSVG(svg) {
  var mySVG = createElement('div');
  mySVG.position(0, 0);
  mySVG.elt.append(svg);
  var myCanvas = createCanvas();
  myCanvas.position(0, 0);
  myCanvas.size(mySVG.size().width, mySVG.size().height);
  
  var buttons = selectAll('.state');

  buttons.forEach(function(button, idx, array) {
    button.mouseClicked(function() {
      print(this.id() + " clicked");
      alert(this.id() + " clicked");
    });
  });
}  


function draw() {
  // nothing to do here for now.
  noLoop();
}
