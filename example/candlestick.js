(function(window, undefined) {
  var dataSrc = new DataSrc();
  var CandlestickChart = window.CandlestickChart;
  var VolumeChart = window.VolumeChart;

  var candleCanvas = d3.select("body").append('svg');
  var volumeCanvas = d3.select("body").append('svg');
  var myCandlestickChart = candleCanvas.chart("CandlestickChart");
  var myVolumeChart = volumeCanvas.chart("VolumeChart");
  myCandlestickChart.draw(dataSrc);
  myVolumeChart.draw(dataSrc);
  //window.i = setInterval(function() {
    //dataSrc.add();
    //myCandlestickChart.draw(dataSrc);
  //}, 1500);
}(window));
