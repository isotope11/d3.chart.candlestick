d3.chart("CandlestickChart", {
  timestamp: function(dateString) {
    return new Date(dateString).getTime() / 1000;
  },
  widthForCandle: function(length) {
    return ((this.width() - this.margin.right) / length) - (2*this.strokeWidth) - (this.candleMargin);
  },
  heightForCandle: function(y, candle) {
    var coreHeight = y(Math.min(Number(candle.open), Number(candle.close))) - y(Math.max(Number(candle.open), Number(candle.close)));
    return coreHeight < 0 ? 0 : coreHeight;
  },
  getStartingY: function(candle){
    return Math.max(Number(candle.open), Number(candle.close));
  },

  initialize: function(options) {
    options = options || {};

    var chart = this;
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();
    this.base
      .attr("class", "candlestick chart");

    this.addGrid(chart);
    this.addWicks(chart);
    this.addOpenLines(chart);
    this.addBars(chart);
    this.addLastTrade(chart);
    this.addInfo(chart);

    this.width(options.width || 900);
    this.height(options.height || 300);

    this.strokeWidth = 1;
    this.candleMargin = 1;
    this.margin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 60
    };
  },

  width: function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = newWidth;
    this.x.range([0, this.w]);
    this.base.attr("width", this.w);
    return this;
  },

  height: function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }
    this.h = newHeight;
    this.y.rangeRound([0, this.h]);
    this.base.attr("height", this.h);
    return this;
  },

  transform: function(data) {
    data = data.data;
    var minX = d3.min(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; }));
    var maxX = d3.max(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; }));
    var minY = d3.min(data.map(function(d){ return Number(d.low); }));
    var maxY = d3.max(data.map(function(d){ return Number(d.high); }));
    var marginY = (maxY - minY) * 0.4;
    this.x.domain([minX, maxX])
      .range([0, this.width() - this.margin.right]);
    this.y.domain([minY - marginY, maxY + marginY])
      .range([this.height(), 0]);
    return data;
  },

  addGrid: function(chart) {
    this.layer("grid-y", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("line.grid.grid-y")
          .data(chart.y.ticks(5));
      },
      insert: function() {
        return this.insert("line")
            .attr('class', 'grid grid-y')
            .attr("x1", 0)
            .attr("x2", chart.width() - chart.margin.right)
            .attr("y1", chart.y)
            .attr("y2", chart.y)
            .attr("stroke-width", 1);
      }
    });

    this.layer("grid-y-labels", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("text.yLabel")
          .data(chart.y.ticks(5));
      },
      insert: function() {
        return this.insert("text")
            .attr('class', 'yLabel')
            .attr("x", chart.width() - chart.margin.right)
            .attr("y", chart.y)
            .attr('dy', 5)
            .attr('dx', 20)
            .attr('text-anchor', 'left')
            .text(function(d){ return String(d.toFixed(1)); });
      }
    });
  },

  addLastTrade: function(chart) {
    function onLastTradeEnter() {
      this.attr('class', 'last-trade-price')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x1", 0)
          .attr("x2", chart.width() - chart.margin.right)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); });
    }

    function onLastTradeEnterTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); });
    }

    function onLastTradeTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); });
    }

    function onLastTradeExitTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); })
          .remove();
    }

    function lastTradeDataBind(data) {
      return this.selectAll("line.last-trade")
        .data([data[data.length - 1]], function(d) { return d.open_time; });
    }

    function lastTradeInsert() {
      return this.insert("line");
    }

    this.layer("last-trade", this.base.append("g").attr("class", "last-trade"), {
      dataBind: lastTradeDataBind,
      insert: lastTradeInsert
    });
    this.layer("last-trade").on("enter", onLastTradeEnter);
    this.layer("last-trade").on("enter:transition", onLastTradeEnterTrans);
    this.layer("last-trade").on("update:transition", onLastTradeTrans);
    this.layer("last-trade").on("exit:transition", onLastTradeExitTrans);
  },


  addWicks: function(chart){
    function onWicksEnter() {
      var length = this.data().length;
      this.attr('class', 'wick')
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("y1", function(d) {
            return chart.y(Number(d.high)) + (2*chart.strokeWidth);
          })
          .attr("y2", function(d) {
            return chart.y(Number(d.low)) + (2*chart.strokeWidth);
          })
          .attr("width", 1);
    }

    function onWicksEnterTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); });
    }

    function onWicksTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); });
    }

    function onWicksExitTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .remove();
    }

    function wickDataBind(data) {
      return this.selectAll("line.wick")
        .data(data, function(d) { return d.open_time; });
    }

    function wickInsert() {
      return this.insert("line");
    }

    this.layer("wicks", this.base.append("g").attr("class", "wicks"), {
      dataBind: wickDataBind,
      insert: wickInsert
    });
    this.layer("wicks").on("enter", onWicksEnter);
    this.layer("wicks").on("enter:transition", onWicksEnterTrans);
    this.layer("wicks").on("update:transition", onWicksTrans);
    this.layer("wicks").on("exit:transition", onWicksExitTrans);
  },

  addOpenLines: function(chart) {
    function onOpenLinesEnter() {
      var length = this.data().length;
      this.attr('class', 'open-line')
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) + (2*chart.strokeWidth);
          })
          .attr("width", function(d){ return chart.widthForCandle(length); })
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
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; });
    }

    function onOpenLinesTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; });
    }

    function onOpenLinesExitTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .remove();
    }

    this.layer("open-lines", this.base.append("g").attr("class", "open-lines"), {
      dataBind: openLinesDataBind,
      insert: openLinesInsert
    });
    this.layer("open-lines").on("enter", onOpenLinesEnter);
    this.layer("open-lines").on("enter:transition", onOpenLinesEnterTrans);
    this.layer("open-lines").on("update:transition", onOpenLinesTrans);
    this.layer("open-lines").on("exit:transition", onOpenLinesExitTrans);
  },

  addBars: function(chart) {
    function onBarsEnter() {
      var length = this.data().length;
      this.attr('class', 'candle')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) + (2*chart.strokeWidth);
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

    function onBarsTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; });
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
    this.layer("bars").on("enter:transition", onBarsEnterTrans);
    this.layer("bars").on("update:transition", onBarsTrans);
    this.layer("bars").on("exit:transition", onBarsExitTrans);
  },

  addInfo: function(chart){
    this.layer("info", this.base.append("g").attr("class", "info"), {
      dataBind: function() { return this.selectAll('rect').data([]); },
      insert: function(){
        return this.insert('text');
      }
    });

    var bisectDate = d3.bisector(function(d){
      return new Date(d.open_time).getTime() / 1000;
    }).left;

    this.base.on('mousemove', function(){
      chart.base.selectAll("rect.info").remove();
      chart.base.selectAll("text.info").remove();
      chart.base.selectAll("line.info").remove();
      var mouseX = d3.mouse(this)[0];
      var mouseY = d3.mouse(this)[1];
      var x0 = chart.x.invert(mouseX);
      var data = chart.layer('bars').selectAll('rect.candle').data();
      var i = bisectDate(data, x0, 1);
      var el = data[i];
      var textBoxWidth = 125;
      var textBoxHeight = 115;

      // Add crosshairs
      chart.layer("info")
        .append("line")
        .attr("class", "info")
        .attr("x1", 0)
        .attr("x2", chart.width())
        .attr("y1", mouseY)
        .attr("y2", mouseY);
      chart.layer("info")
        .append("line")
        .attr("class", "info")
        .attr("x1", mouseX)
        .attr("x2", mouseX)
        .attr("y1", 0)
        .attr("y2", chart.height());
      if(el){
        var lineHeight = 15;
        var textMargin = 6;
        chart.layer("info")
          .append("rect")
          .attr("class", "info")
          .attr("width", textBoxWidth)
          .attr("height", textBoxHeight)
          .attr("x", 0)
          .attr("y", 0);
        var textBox = chart.layer("info")
          .append("text")
          .attr('class', 'info')
          .attr('y', textMargin)
          .attr('x', textMargin)
          .attr('width', textBoxWidth - (2*textMargin))
          .attr('height', textBoxHeight - (2*textMargin));
        var y = lineHeight;
        // Append data title
        textBox.append('tspan')
          .attr('x', textMargin)
          .attr('y', y)
          .text('Mt. Gox')
          .attr('class', 'title');
        y = y + lineHeight;
        // Append date
        var openDate = new Date(el.open_time);
        textBox.append('tspan')
          .attr('x', textMargin)
          .attr('y', y)
          .attr('class', 'date')
          .text(openDate.toLocaleString());
        y = y + lineHeight;
        // Append 'titled' fields:
        [
          ["Open", el.open],
          ["High", el.high],
          ["Low", el.low],
          ["Close", el.close],
          ["Vol", el.volume]
        ].forEach(function(d){
           textBox.append('tspan')
             .attr('class', 'titled-title')
             .attr("x", textMargin)
             .attr("y", y)
             .text(d[0] + ':');
           textBox.append('tspan')
             .attr('class', 'titled-data')
             .attr('dx', 0)
             .text(' ' + d[1]);
           y = y + lineHeight;
         });
      }
    });

    this.base.on('mouseout', function(){
      var bbox = chart.base[0][0].getBBox();
      var outsideX = event.x < bbox.x || event.x > (bbox.x + bbox.width);
      var outsideY = event.y < bbox.y || event.y > (bbox.y + bbox.height);
      if(outsideY || outsideX){
        chart.base.selectAll("rect.info").remove();
        chart.base.selectAll("text.info").remove();
        chart.base.selectAll("line.info").remove();
      }
    });
  }
});
