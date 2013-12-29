(function(window, undefined) {
  var dataSrc = new DataSrc();
  dataSrc.alertStupidData();
  var CandlestickChart = window.CandlestickChart;
  var OHLCChart = window.OHLCChart;
  var VolumeChart = window.VolumeChart;

  var clearCharts = function(){
    $('svg').remove();
  };

  var normalCandlesticks = function(){
    clearCharts();

    var candleCanvas = d3.select("body").append('svg');
    $('br.clear').remove();
    d3.select("body").append('br').attr('class', 'clear');
    var volumeCanvas = d3.select("body").append('svg');
    var myCandlestickChart = candleCanvas.chart("CandlestickChart", { exchange: 'BTC-E', lines: ['ema', 'bb'], period: 60 });
    var myVolumeChart = volumeCanvas.chart("VolumeChart", { period: 60 });
    myCandlestickChart.draw(dataSrc);
    myVolumeChart.draw(dataSrc);
    window.i = setInterval(function() {
      dataSrc.randomizeLastClosePrice();
      myCandlestickChart.draw(dataSrc);
    }, 1500);
  };

  var ohlcChart = function(){
    clearCharts();

    var candleCanvas = d3.select("body").append('svg');
    $('br.clear').remove();
    d3.select("body").append('br').attr('class', 'clear');
    var volumeCanvas = d3.select("body").append('svg');
    var myCandlestickChart = candleCanvas.chart("OHLCChart", { exchange: 'Mt. Gox', lines: ['ema', 'bb'], period: 60 });
    var myVolumeChart = volumeCanvas.chart("VolumeChart", { period: 60 });
    myCandlestickChart.draw(dataSrc);
    myVolumeChart.draw(dataSrc);
    window.i = setInterval(function() {
      dataSrc.randomizeLastClosePrice();
      myCandlestickChart.draw(dataSrc);
    }, 1500);
  };

  $('a.ohlc').on('click', function(){ ohlcChart(); });
  $('a.candlesticks').on('click', function(){ normalCandlesticks(); });

  normalCandlesticks();
}(window));
