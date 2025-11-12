// This file should be used in the GEE interface. It creates a task to 
// download the CSV file containing all fires with a given minimum size
// in a given year from the GlobFire database.

// Rough outlines of the BC province.
var geometry =ee.Geometry.Polygon([[
  [-139.12728527877687, 60.04376396339371],
  [-137.54525402877687, 58.88283251565374],
  [-135.47982434127687, 59.80150093070188],
  [-130.03060559127687, 55.876277412726616],
  [-130.82162121627687, 54.573060422748796],
  [-128.31673840377687, 50.542457947684596],
  [-124.66927746627687, 48.60499694088699],
  [-123.48275402877687, 48.19653592642649],
  [-123.08724621627687, 49.09658036376255],
  [-114.16634777877687, 49.0101809730787],
  [-114.82552746627687, 49.5548432629725],
  [-114.95736340377687, 50.458600948736084],
  [-119.92318371627687, 53.74972963534228],
  [-120.01107434127687, 60.02181309090946],
  [-139.12728527877687, 60.04376396339371]
]]);

var fc = ee.FeatureCollection(geometry);

var computeArea = function (f) {
  return f.set({'area': f.area()});
}
var computeCentroid = function (f) {
  return f.set({'lon': f.geometry().centroid().coordinates().get(0), 'lat': f.geometry().centroid().coordinates().get(1)});
}
var computeDate = function (f) {
  return f.set({'start_date': ee.Date(f.get('IDate')), 'end_date': ee.Date(f.get('FDate'))});
}

// Start generate all fires. Change the year here, to generate fires for a different year.
var year = '2015';
var min_size = 1e7;

// Find fires in the GlobFire database that are in the contiguous BC and in the given year.
var polygons = ee.FeatureCollection('JRC/GWIS/GlobFire/v2/FinalPerimeters')
                  .filter(ee.Filter.gt('IDate', ee.Date(year+'-01-01').millis()))
                  .filter(ee.Filter.lt('IDate', ee.Date(year+'-12-31').millis()))
                  .filterBounds(geometry);
                  

// Filter out all the Invalid large areas (Infinity), and small wildfires.
polygons = polygons.map(computeArea);
polygons = polygons.filter(ee.Filter.gt('area', min_size)).filter(ee.Filter.lt('area', 1e20));
polygons = polygons.map(computeCentroid).map(computeDate());

// Generate task to download the CSV file. Needs to be clicked on the task tab.
Export.table.toDrive({
    collection: polygons, 
    description: 'bc_fire_'+year+'_'+ String(min_size),
    fileFormat: 'csv'
  })