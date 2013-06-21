## d3.chart.template

To get your chart published on the d3.chart [website](http://misoproject.com/d3-chart/charts.html) there are only two requirements:

* You must name your repo in the following format: `d3.chart.*`. For example: `d3.chart.barchart` or `d3.chart.my-epic-chart`. 
* You must have a `package.json` in your repo that declares the version of d3.chart that your chart utilizes like so:

```json
{
  "d3.chart": {
    "version" : "0.0.1"
  }
}
```

### Template Structure

This template comes with a few helpful files:

* A `Gruntfile.js` containing code linting, watching & building tasks that may be useful during development and release.
* A `package.json` file containing some basic placeholder info that you can replace with your chart's details.
* An `example` folder which might be useful to try out your chart while you develop and to release alongside 
your chart for others to see how your chart can be utilized.


#### Using Grunt

1. You will need to use grunt > 0.4 to build your chart distribution files.
2. Run `npm install` to obtain the appropriate grunt tasks. Do not check in the `node_modules` folder - it is listed in the `.gitignore` file.

Some useful grunt commands:

* `grunt watch` will watch for file changes and run the js files through linting to check for syntax errors and warnings.
* `grunt` will build your chart into a single file if you've split them up.

### Suggested Guidelines:

* Please maintain your `package.json` with the appropriate versioning and dependencies.

* Please consider licensing your charts under the MIT Expat license or any other BSD-style license. 

* Please try to document your code & API

* Please provide some example usage for your chart, either in the examples folder or in this readme.

* Consider defining what API your chart exposes - this includes
  * getters/setters and any other methods that are available on the chart instance.
  * any events that the chart broadcasts alongside the arguments that will be passed to the callbacks.

Thank you for using d3.chart!
- The Miso Project Team.

---------

## Readme Template:

# Chart name...

Chart description...

### Sample Use

Please provide sample use of your chart here.

### API

Sample API Documentation:

#### `<instance>.highlight(value)`

**Description:**

Allows the highlighting of a specific value

**Parameters:**

* `value` - The value to highlight.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart")
  .higlight(12);
```

### Events

Sample Event Documentation:

#### `brush`

**Description:**

Broadcast when a circle on the chart is being mousedover

**Arguments:**

* `value` - The value corresponding to the circle being mousedover.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyEpicChart");

chart.on("brush", function(value) {
  // handle event...
});
```