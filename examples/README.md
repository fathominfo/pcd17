# processing-community-day
Resources and examples for the Fathom workshop at Processing Community Day, 2017

Because of how easy it is to share things on the web, many of the examples here use p5.js. These examples could be built in desktopProcessing as well, but we save the desktop examples for situations that aren't easily handled on the web: saving files, and handling large data sets.

## p5js_miles
[This example](https://github.com/fathominfo/pcd17/tree/master/examples/p5js_miles) is good for beginners to see how new features can be added to a sketch in p5.js. The five sketches here start with loading a data file and building a timeline. We then add a basic hover interaction, and refine that with each iteration.


## p5js_lfpr
[This example](https://github.com/fathominfo/pcd17/tree/master/examples/p5js_lfpr) is a more advanced p5.js sketch. It demonstrates animated transitions, merging multiple data files, storing data in objects, sorting a dataset in several different ways, and creating clickable buttons. This is based on the labor force participation rate visualization on the front page of [noceilings.org](http://www.noceilings.org/).

## p5js_mapping_points
[This example](https://github.com/fathominfo/pcd17/tree/master/examples/p5js_mapping_points) is a p5.js sketch showing how to map geographic coordinates using zip code data.

## p5js_usmap_svg
[This p5.js sketch](https://github.com/fathominfo/pcd17/tree/master/examples/p5js_usmap_svg) shows a map of shapes as opposed to geographic points. The code fetches a Scalable Vector Graphic (SVG) file of a map of the US and adds it to the page. It then makes every state clickable. 

## p5js_worldmap_svg
[This p5.js sketch](https://github.com/fathominfo/pcd17/tree/master/examples/p5js_worldmap_svg) is another SVG map (of the world this time), but colors the map according to data in a different file. This is also a good example of merging data from multiple files. There is also a [desktop version of this example](https://github.com/fathominfo/noceilings-data/tree/master/examples/map_export) that prints a pdf of the map to your desktop. Automatically generating files is much easier in desktop processing than p5.js.

## processing_quakes_pdf
Unlike the other sketches, [this one](https://github.com/fathominfo/pcd17/tree/master/examples/processing_quakes_pdf) uses desktop Processing. That makes it easier to read in large files and generate a PDF. 

