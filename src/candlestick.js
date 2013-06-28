d3.chart("BaseCandlestickChart").extend("CandlestickChart", {
  addBars: function(chart){
    function onBarsEnter() {
      var length = this.data().length;
      this.attr('class', 'candle')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
          })
          .attr("width", function(d){ return chart.widthForCandle(length); })
          .attr("height", function(d) {
            return chart.heightForCandle(chart.y, d);
          })
          .attr("stroke-width", chart.strokeWidth);
    }
    function onBarsEnterTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; });
    }

    function onBarsUpdate() {
      this.classed('fall', function(d){ return Number(d.open) > Number(d.close); });
    }

    function onBarsTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
          })
          .attr("height", function(d) {
            return chart.heightForCandle(chart.y, d);
          });
    }

    function onBarsExitTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .remove();
    }
    function barsDataBind(data) {
      return this.selectAll("rect.candle")
        .data(data, function(d) { return d.open_time; });
    }

    function barsInsert() {
      return this.insert("rect");
    }

    this.layer("bars", this.base.append("g").attr("class", "bars"), {
      dataBind: barsDataBind,
      insert: barsInsert
    });

    this.layer("bars").on("enter", onBarsEnter);
    this.layer("bars").on("update", onBarsUpdate);
    this.layer("bars").on("enter:transition", onBarsEnterTrans);
    this.layer("bars").on("update:transition", onBarsTrans);
    this.layer("bars").on("exit:transition", onBarsExitTrans);
  },

  getBarData: function(chart){
    return chart.layer('bars').selectAll('rect.candle').data();
  }
});
