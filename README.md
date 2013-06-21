# d3.chart.candlestick

A candlestick chart for d3.chart.

### Sample Use

Please provide sample use of your chart here...will do

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
