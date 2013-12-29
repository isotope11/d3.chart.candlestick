d3.chart("BaseCandlestickChart", {
  timestamp: function(dateString) {
    return new Date(dateString).getTime() / 1000;
  },
  widthForCandle: function(length) {
    var width = ((this.width() - this.margin.right) / (length)) - (2*this.strokeWidth) - (this.candleMargin);
    return width;
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

    this.exchange = (options.exchange || '');
    this.lines = (options.lines || []);
    this.period = (options.period || 0);

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
    this.addLines(chart, this.lines);
    this.addInfo(chart);

    this.width(options.width || 900);
    this.height(options.height || 300);

    this.strokeWidth = options.strokeWidth || 1;
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

  transform: function(_data) {
    var data;
    data = this.extractData(_data);
    var minX = d3.min(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; }));
    var maxX = d3.max(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; })) + this.period;
    var minY = d3.min(data.map(function(d){ return Number(d.low); }));
    var maxY = d3.max(data.map(function(d){ return Number(d.high); }));
    var marginY = (maxY - minY) * 0.4;
    this.x.domain([minX, maxX])
      .range([0, this.width() - this.margin.right]);
    this.y.domain([minY - marginY, maxY + marginY])
      .range([this.height(), 0]);
    return data;
  },

  extractData: function(_data){
    var data;
    data = _data.data;
    // If ema data was passed in, merge it into each data point
    this.lines.forEach(function(lineType) {
      if(_data[lineType]){
        data.forEach(function(datum, i){
          if(_data[lineType][i]){
            datum[lineType] = _data[lineType][i].price;
          }
        });
      }
    });
    return data;
  },

  addGrid: function(chart) {
    this.addGridY(chart);
    this.addGridYLabels(chart);
  },

  addGridY: function(chart) {
    function onGridYEnter() {
      this.attr('class', 'grid grid-y')
          .attr("x1", 0)
          .attr("x2", chart.width() - chart.margin.right)
          .attr("y1", chart.y)
          .attr("y2", chart.y)
          .attr("stroke-width", 1);
    }

    function onGridYTrans() {
      this.duration(1000)
          .attr("y1", chart.y)
          .attr("y2", chart.y);
    }

    function onGridYExitTrans() {
      this.duration(1000)
          .remove();
    }

    this.layer("grid-y", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("line.grid.grid-y")
          .data(chart.y.ticks(5));
      },
      insert: function() {
        return this.insert("line");
      }
    });
    this.layer("grid-y").on("enter", onGridYEnter);
    this.layer("grid-y").on("update:transition", onGridYTrans);
    this.layer("grid-y").on("exit:transition", onGridYExitTrans);
  },

  addGridYLabels: function(chart) {
    function onGridYLabelsEnter() {
      this.attr('class', 'yLabel')
          .attr("x", chart.width() - chart.margin.right)
          .attr("y", chart.y)
          .attr('dy', 5)
          .attr('dx', 20)
          .attr('text-anchor', 'left')
          .text(function(d){ return String(d.toFixed(1)); });
    }

    function onGridYLabelsUpdate() {
      this.text(function(d){ return String(d.toFixed(1)); });
    }

    function onGridYLabelsTrans() {
      this.duration(1000)
          .attr("x", chart.width() - chart.margin.right)
          .attr("y", chart.y)
          .attr('dy', 5)
          .attr('dx', 20);
    }

    function onGridYLabelsExitTrans() {
      this.duration(1000).remove();
    }

    this.layer("grid-y-labels", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("text.yLabel")
          .data(chart.y.ticks(5));
      },
      insert: function() {
        return this.insert("text");
      }
    });

    this.layer("grid-y-labels").on("enter", onGridYLabelsEnter);
    this.layer("grid-y-labels").on("update", onGridYLabelsUpdate);
    this.layer("grid-y-labels").on("update:transition", onGridYLabelsTrans);
    this.layer("grid-y-labels").on("exit:transition", onGridYLabelsExitTrans);
  },

  addLastTrade: function(chart) {
    this.addLastTradeLine(chart);
    this.addLastTradeSlab(chart);
    this.addLastTradeLabel(chart);
  },

  addLastTradeLine: function(chart) {
    function onLastTradeEnter() {
      this.attr('class', 'last-trade-price')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x1", 0)
          .attr("x2", chart.width() - chart.margin.right)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); });
    }

    function onLastTradeUpdate() {
      this.classed('fall', function(d){ return Number(d.open) > Number(d.close); });
    }

    function onLastTradeTrans() {
      this.duration(1000)
          .attr("y1", function(d) { return chart.y(Number(d.close)); })
          .attr("y2", function(d) { return chart.y(Number(d.close)); });
    }

    function onLastTradeExitTrans() {
      this.remove();
    }

    function lastTradeDataBind(data) {
      return this.selectAll("line.last-trade-price")
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
    this.layer("last-trade").on("update", onLastTradeUpdate);
    this.layer("last-trade").on("update:transition", onLastTradeTrans);
    this.layer("last-trade").on("exit:transition", onLastTradeExitTrans);
  },

  addLastTradeSlab: function(chart) {
    var rectWidth = 48;
    var rectWidthOffset = rectWidth * 0.25;
    var rectHeight = 19;
    var rectHeightOffset = rectHeight/2 - 1;
    function onLastTradeEnter() {
      this.attr('class', 'last-trade-slab')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", chart.width() - chart.margin.right + rectWidthOffset)
          .attr("y", function(d){ return chart.y(Number(d.close)) - rectHeightOffset; })
          .attr("rx", 3)
          .attr("ry", 3)
          .attr('width', rectWidth)
          .attr('height', rectHeight);
    }

    function onLastTradeUpdate() {
      this.classed('fall', function(d){ return Number(d.open) > Number(d.close); });
    }

    function onLastTradeTrans() {
      this.duration(1000)
          .attr("y", function(d){ return chart.y(Number(d.close)) - rectHeightOffset; });
    }

    function onLastTradeExitTrans() {
      this.remove();
    }

    function lastTradeDataBind(data) {
      return this.selectAll("rect.last-trade-slab")
        .data([data[data.length - 1]], function(d) { return d.open_time; });
    }

    function lastTradeInsert() {
      return this.insert("rect");
    }

    this.layer("last-trade-slab", this.base.append("g").attr("class", "last-trade-slab"), {
      dataBind: lastTradeDataBind,
      insert: lastTradeInsert
    });
    this.layer("last-trade-slab").on("enter", onLastTradeEnter);
    this.layer("last-trade-slab").on("update", onLastTradeUpdate);
    this.layer("last-trade-slab").on("update:transition", onLastTradeTrans);
    this.layer("last-trade-slab").on("exit:transition", onLastTradeExitTrans);
  },

  addLastTradeLabel: function(chart) {
    function onLastTradeEnter() {
      this.attr('class', 'last-trade-label')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", chart.width() - chart.margin.right)
          .attr("y", function(d){ return chart.y(Number(d.close)); })
          .attr('dy', 5)
          .attr('dx', 20)
          .attr('text-anchor', 'left')
          .text(function(d){ return String(Number(d.close).toFixed(1)); });
    }

    function onLastTradeUpdate() {
      this.classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .text(function(d){ return String(Number(d.close).toFixed(1)); });
    }

    function onLastTradeTrans() {
      this.duration(1000)
          .attr("y", function(d){ return chart.y(Number(d.close)); });
    }

    function onLastTradeExitTrans() {
      this.remove();
    }

    function lastTradeDataBind(data) {
      return this.selectAll("text.last-trade-label")
        .data([data[data.length - 1]], function(d) { return d.open_time; });
    }

    function lastTradeInsert() {
      return this.insert("text");
    }

    this.layer("last-trade-label", this.base.append("g").attr("class", "last-trade-label"), {
      dataBind: lastTradeDataBind,
      insert: lastTradeInsert
    });
    this.layer("last-trade-label").on("enter", onLastTradeEnter);
    this.layer("last-trade-label").on("update", onLastTradeUpdate);
    this.layer("last-trade-label").on("update:transition", onLastTradeTrans);
    this.layer("last-trade-label").on("exit:transition", onLastTradeExitTrans);
  },

  addWicks: function(chart){
    function onWicksEnter() {
      var length = this.data().length;
      this.attr('class', 'wick')
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("y1", function(d) { return chart.y(Number(d.high)); })
          .attr("y2", function(d) { return chart.y(Number(d.low)); })
          .attr("width", 1);
    }

    function onWicksEnterTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("y1", function(d) { return chart.y(Number(d.high)); })
          .attr("y2", function(d) { return chart.y(Number(d.low)); });
    }

    function onWicksTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("y1", function(d) { return chart.y(Number(d.high)); })
          .attr("y2", function(d) { return chart.y(Number(d.low)); });
    }

    function onWicksExitTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x1", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("x2", function(d, i) { return chart.x(chart.timestamp(d.open_time)) + (chart.widthForCandle(length) / 2); })
          .attr("y1", function(d) { return chart.y(Number(d.high)); })
          .attr("y2", function(d) { return chart.y(Number(d.low)); })
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

  addLines: function(chart, lines) {
    // currently supported lines: ['ema', 'bb'] 
    var that = this;
    if(typeof lines !== 'undefined' && lines.length > 0) {
      lines.forEach(function(lineType) {
        chart.addLine(lineType, chart);
      });
    }
  },

  addLine: function(lineType, chart) {
    var line = d3.svg.line()
      .x(function(d, i){
        return chart.x(chart.timestamp(d.open_time));
      })
      .y(function(d, i){
        if(d[lineType]){
          return chart.y(d[lineType]);
        } else {
          return chart.y(0);
        }
      });

    function onEmaEnter(){
      var lastDatum, oldLastDatum;
      this.attr('class', lineType)
        .attr("d", function(d, i){
          if(lastDatum){
            oldLastDatum = lastDatum;
            lastDatum = d;
            return line([oldLastDatum, d]);
          }
          lastDatum = d;
        });
    }

    function onEmaEnterTrans() {
      var lastDatum, oldLastDatum;
      this.duration(1000)
        .attr("d", function(d, i){
          if(lastDatum){
            oldLastDatum = lastDatum;
            lastDatum = d;
            return line([oldLastDatum, d]);
          }
          lastDatum = d;
        });
    }

    function onEmaTrans() {
      var lastDatum, oldLastDatum;
      this.duration(1000)
        .attr("d", function(d, i){
          if(lastDatum){
            oldLastDatum = lastDatum;
            lastDatum = d;
            return line([oldLastDatum, d]);
          }
          lastDatum = d;
        });
    }

    function onEmaExitTrans() {
      var lastDatum, oldLastDatum;
      this.duration(1000)
        .attr("d", function(d, i){
          if(lastDatum){
            oldLastDatum = lastDatum;
            lastDatum = d;
            return line([oldLastDatum, d]);
          }
          lastDatum = d;
        }).remove();
    }

    function emaDataBind(data){
      var newData = [];
      data.forEach(function(datum){
        if(datum[lineType]){
          newData.push(datum);
        }
      });
      return this.selectAll("path." + lineType)
        .data(newData, function(d) { return d.open_time; });
    }

    function emaInsert() {
      return this.insert('path');
    }

    this.layer(lineType, chart.base.append("g").attr("class", lineType), {
      dataBind: emaDataBind,
      insert: emaInsert
    });
    this.layer(lineType).on("enter", onEmaEnter);
    this.layer(lineType).on("enter:transition", onEmaEnterTrans);
    this.layer(lineType).on("update:transition", onEmaTrans);
    this.layer(lineType).on("exit:transition", onEmaExitTrans);
  },

  addOpenLines: function(chart) {
    function onOpenLinesEnter() {
      var length = this.data().length;
      this.attr('class', 'open-line')
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
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
      var length = this[0].length;
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .attr("y", function(d) {
            return chart.y(chart.getStartingY(d)) - (chart.strokeWidth);
          })
          .attr("width", function(d){ return chart.widthForCandle(length); });
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
  },

  addBars: function(chart) {
  },

  getBarData: function(chart){
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

    var addInfoBoxes = function(){
      var textBoxWidth = 200;
      var textBoxHeight = 115;
      var lineHeight = 15;
      var textMargin = 6;

      // Add crosshairs
      chart.layer("info")
        .append("line")
        .attr("class", "info line-x")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", 0);
      chart.layer("info")
        .append("line")
        .attr("class", "info line-y")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", 0);

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
        .text(chart.exchange)
        .attr('class', 'title');
      y = y + lineHeight;
      // Append date
      var openDate = '';
      textBox.append('tspan')
        .attr('x', textMargin)
        .attr('y', y)
        .attr('class', 'date')
        .text(openDate.toLocaleString());
      y = y + lineHeight;
      // Append 'titled' fields:
      [
        ["Open", ''],
        ["High", ''],
        ["Low", ''],
        ["Close", ''],
        ["Vol", '']
      ].forEach(function(d){
        textBox.append('tspan')
          .attr('class', 'titled-title ' + d[0].toLowerCase())
          .attr("x", textMargin)
          .attr("y", y)
          .text(d[0] + ':');
        textBox.append('tspan')
          .attr('class', 'titled-data ' + d[0].toLowerCase())
          .attr('dx', 0)
          .text(' ' + d[1]);
        y = y + lineHeight;
      });

      chart.layer('info').style('display', 'none');
    };

    addInfoBoxes();

    this.base.on('mousemove', function(){
      chart.layer('info').style('display', 'block');
      var mouseX = d3.mouse(this)[0];
      var mouseY = d3.mouse(this)[1];
      var x0 = chart.x.invert(mouseX);
      var data = chart.getBarData(chart);
      var i = bisectDate(data, x0, 1) - 1;
      var el = data[i];

      // Add crosshairs
      chart.layer("info")
        .select("line.line-x")
        .attr("x2", chart.width())
        .attr("y1", mouseY)
        .attr("y2", mouseY);
      chart.layer("info")
        .select("line.line-y")
        .attr("x1", mouseX)
        .attr("x2", mouseX)
        .attr("y2", chart.height());

      if(el){
        var openDate = new Date(el.open_time);
        chart.layer('info').select('tspan.date').text(openDate.toLocaleString());

        [
          ["Open", el.open],
          ["High", el.high],
          ["Low", el.low],
          ["Close", el.close],
          ["Vol", el.volume]
        ].forEach(function(d){
          chart.layer('info').select('tspan.titled-title.' + d[0].toLowerCase())
            .text(d[0] + ':');
          chart.layer('info').select('tspan.titled-data.' + d[0].toLowerCase())
            .text(' ' + d[1]);
        });
      }
    });

    this.base.on('mouseout', function(evt){
      var bbox = chart.base[0][0].getBBox();
      var eventX, eventY;

      var mouseX = d3.mouse(this)[0];
      var mouseY = d3.mouse(this)[1];
      eventX = (typeof event !== 'undefined') ? event.x : mouseX;
      eventY = (typeof event !== 'undefined') ? event.y : mouseY;
      var outsideX = eventX < bbox.x || eventX > (bbox.x + bbox.width);
      var outsideY = eventY < bbox.y || eventY > (bbox.y + bbox.height);
      if(outsideY || outsideX){
        chart.layer('info').style('display', 'none');
      }
    });
  }
});
