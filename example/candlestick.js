(function(window, undefined) {
  var dataSrc = new DataSrc();
  var CandlestickChart = window.CandlestickChart;

  var canvas = d3.select("body").append('svg');
  var myCandlestickChart = canvas.chart("CandlestickChart");
  myCandlestickChart.draw(dataSrc);
  //setInterval(function() {
    //dataSrc.add();
    //myCandlestickChart.draw(dataSrc);
  //}, 1500);
}(window));
