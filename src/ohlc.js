d3.chart("BaseCandlestickChart").extend("OHLCChart", {
  // The open line will take care of the open bit, and the close line will be taken care of as if it were the bar.
  addBars: function(chart){
    function xPosition(d, lineWidth) {
      if(Number(d.open) > Number(d.close)){
        return chart.x(chart.timestamp(d.open_time)) + lineWidth;
      } else {
        return chart.x(chart.timestamp(d.open_time));
      }
    }

    function onBarsEnter() {
      var length = this.data().length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.attr('class', 'ohlc')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", function(d, i) { return xPosition(d, lineWidth); })
          .attr("y", function(d) {
            var height = chart.heightForCandle(chart.y, d);
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth) + height;
          })
          .attr("width", lineWidth)
          .attr("height", 1);
    }
    function onBarsEnterTrans() {
      var length = this[0].length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.duration(1000)
          .attr("x", function(d, i) { return xPosition(d, lineWidth); });
    }

    function onBarsUpdate() {
      this.classed('fall', function(d){ return Number(d.open) > Number(d.close); });
    }

    function onBarsTrans() {
      var length = this[0].length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.duration(1000)
          .attr("x", function(d, i) { return xPosition(d, lineWidth); })
          .attr("y", function(d) {
            var height = chart.heightForCandle(chart.y, d);
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth) + height;
          });
    }

    function onBarsExitTrans() {
      var length = this[0].length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + lineWidth; })
          .remove();
    }
    function barsDataBind(data) {
      return this.selectAll("rect.ohlc")
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
    return chart.layer('bars').selectAll('rect.ohlc').data();
  },

  addOpenLines: function(chart) {
    function xPosition(d, lineWidth) {
      if(Number(d.open) > Number(d.close)){
        return chart.x(chart.timestamp(d.open_time));
      } else {
        return chart.x(chart.timestamp(d.open_time)) + lineWidth;
      }
    }

    function onOpenLinesEnter() {
      var length = this.data().length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.attr('class', 'open-line')
          .attr("x", function(d, i) { return xPosition(d, lineWidth); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
          })
          .attr("width", lineWidth)
          .attr("height", 1);
    }

    function openLinesDataBind(data) {
      return this.selectAll("rect.open-line")
        .data(data, function(d) { return d.open_time; });
    }

    function openLinesInsert() {
      return this.insert("rect");
    }

    function onOpenLinesEnterTrans() {
      var length = this[0].length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.duration(1000)
          .attr("x", function(d, i) { return xPosition(d, lineWidth); });
    }

    function onOpenLinesTrans() {
      var length = this[0].length;
      var lineWidth = chart.widthForCandle(length) / 2;
      this.duration(1000)
          .attr("x", function(d, i) { return xPosition(d, lineWidth); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
          })
          .attr("width", function(d){ return lineWidth; });
    }

    function onOpenLinesExitTrans() {
      this.remove();
    }

    this.layer("open-lines", this.base.append("g").attr("class", "open-lines"), {
      dataBind: openLinesDataBind,
      insert: openLinesInsert
    });
    this.layer("open-lines").on("enter", onOpenLinesEnter);
    this.layer("open-lines").on("enter:transition", onOpenLinesEnterTrans);
    this.layer("open-lines").on("update:transition", onOpenLinesTrans);
    this.layer("open-lines").on("exit:transition", onOpenLinesExitTrans);
  }
});
