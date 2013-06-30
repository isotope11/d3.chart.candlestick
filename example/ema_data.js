
// datasrc.js
// A simple data source to feed the bar chart visualization. Based on the
// implementation in "A Bar Chart, part 2":
// http://mbostock.github.com/d3/tutorial/bar-2.html
(function(window, undefined) {

  "use strict";

  var d3 = window.d3;

  var EMAData = window.EMAData = function() {
    var self = this;
    this.data = [
      { open_time: "1", price: "99" },
      { open_time: "2", price: "98" },
      { open_time: "3", price: "100" },
      { open_time: "4", price: "99.5" },
      { open_time: "5", price: "101" },
      { open_time: "6", price: "98" },
      { open_time: "7", price: "97" },
      { open_time: "8", price: "97" }
    ];
  };
}(this));
