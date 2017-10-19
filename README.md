# processing-community-day
Resources and examples for the Fathom workshop at Processing Community Day, 2017

Because of how easy it is to share things on the web, many of the examples here use p5.js. These examples could be built in desktopProcessing as well, but we save the desktop examples for situations that aren't easily handled on the web: saving files, and handling large data sets.

## p5js_miles
This example is good for beginners to see how new features can be added to a sketch in p5.js. If you are new to processing or p5.js, this is a good place to start. The source data is based on the recording career of Miles Davis, and the sketches build up to something akin to ["Scaled in Miles"](https://fathom.info/miles-web/). 
1. [mvp_01](examples/mvp_01/) starts with the basics of loading a json file, and lays out a fixed timeline of recording sessions
1. [mvp_02](examples/mvp_02/) adds a little interactivity, showing the place and date of whichever recording session the mouse is over currently. 
1. [mvp_03](examples/mvp_03/) adds the list of musicians for each recording session
1. [mvp_04](examples/mvp_04/) adds an indicator for each musician in the current session to show how oftern they recorded with Miles. 
1. [mvp_05](examples/mvp_05/) improves just a little on mvp_04 by sorting the musicians who played on the date.


## p5js_lfpr
[This example](examples/p5js_lfpr) is a more advanced demonstration of animation. It draws on the data from [No Ceilings](http://noceilings.org), available at [https://github.com/fathominfo/noceilings-data](https://github.com/fathominfo/noceilings-data). This particular piece depicts the Labor Force Participation Rate for each country, comparing what percentage of the population is employed for men and women. The code demonstrates how to load and reference JSON data in p5js, and some of the cleanup required to bring together multiple datasets. In addition to hovering the visualization, this example shows how to use the p5js dom library to create buttons, and how make code execute when a button is clicked. It also provides examples of how to sort the same data in different ways, and to animate the data as it transitions between different states. 


## p5js_mapping_points
[This example](examples/p5js_mapping_points) uses zip code data to show how to draw map coordinates on the canvas. The code includes functions that take the latitude and longitude points and calculates the specific location based on different projections (Albers is shown, but Mercator is included in the code as well). After the locations have been calculated, points can be drawn based on their x and y positions in the projection. 


## p5js_usmap_svg
Besides drawing geographic points, many maps show country shapes. In the web world, a common way to do this is to use an SVG (Scalable Vector Graphic) file. SVG’s are images which can be searched, indexed and scaled to different sized without looking pixelated. This is a very different type of image from the p5.js canvas, and adding this to your sketch can bypass a lot of what makes p5.js great. This example demonstrates the basics of loading an SVG into p5.js, and how to connect code to clicking every state. 

## p5js_worldmap_svg
This example builds on the basic p5.js SVG map exmaple by coloring the map according to data values. The driving data is an indicator from the [noceilings data data repository](https://github.com/fathominfo/noceilings-data) showing primary school enrollment for girls by country and for a specific year. You can click on a country to get an alert with the data values. You can edit the code to show the map for a diferent year, or you can download another indicator from the no ceilings repository to show it (instructions are in the code). 

One of the challenges of working with data from different sources is how to join them: in this case, we have to join the indicator data with the map, each using their own set of codes to label the countries of the world. To merge them, we need a third file. This example shows how to do load the data sources and the map, merge them, and then take the result to color every country. 

To highlight where desktop processing can be useful, there is a [desktop version of this example](https://github.com/fathominfo/noceilings-data/tree/master/examples/map_export) that prints a pdf of the map to your desktop. 


## processing_quakes_pdf
This example demonstrates a couple highlights of desktop Processing. It loads a data file that is larger than what you typically wnat to load over the web, and then prints it as a PDF after it’s drawn. Again using an SVG to map indicators, the code also shows how to create a table to connect the country code values in the data to the values in the SVG.

