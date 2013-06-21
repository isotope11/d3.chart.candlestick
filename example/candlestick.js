(function(window, undefined) {
  // YOUR SAMPLE CHART USAGE GOES HERE.
  var dataSrc = new DataSrc();
  var CandlestickChart = window.CandlestickChart;

  var myCandlestickChart = d3.select("body")
    .append("svg").chart("CandlestickChart");
  myCandlestickChart.draw(dataSrc);
  setInterval(function() {
    dataSrc.fetch();
    myCandlestickChart.draw(dataSrc);
  }, 1500);
}(window));
