d3.chart("VolumeChart", {
  timestamp: function(dateString) {
    return new Date(dateString).getTime() / 1000;
  },
  widthForBar: function(length) {
    return ((this.width() - this.margin.right) / length) - (2*this.strokeWidth) - (this.candleMargin);
  },
  heightForBar: function(y, candle) {
    var coreHeight = y(candle.volume);
    return coreHeight;
  },

  initialize: function(options) {
    options = options || {};

    this.period = (options.period || 0);

    var chart = this;
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();
    this.base
      .attr("class", "volume chart");

    this.addBars(chart);

    this.width(options.width || 900);
    this.height(options.height || 100);

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

  transform: function(data) {
    data = data.data;
    var minX = d3.min(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; }));
    var maxX = d3.max(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; })) + this.period;
    var minY = d3.min(data.map(function(d){ return Number(d.volume); }));
    var maxY = d3.max(data.map(function(d){ return Number(d.volume); }));
    var marginY = (maxY - minY) * 0.4;
    this.x.domain([minX, maxX])
      .range([0, this.width() - this.margin.right]);
    this.y.domain([0, maxY])
      .range([0, this.height()]);
    return data;
  },

  addBars: function(chart) {
    function onBarsEnter() {
      var length = this.data().length;
      this.attr('class', 'volume')
          .classed('fall', function(d){ return Number(d.open) > Number(d.close); })
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.height() - chart.heightForBar(chart.y, d);
          })
          .attr("width", function(d){ return chart.widthForBar(length); })
          .attr("height", function(d) {
            return chart.heightForBar(chart.y, d);
          })
          .attr("fill", "white");
    }
    function onBarsEnterTrans() {
      var length = this[0].length;
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; });
    }

    function onBarsTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .attr("y", function(d) {
            return chart.height() - chart.heightForBar(chart.y, d);
          })
          .attr("height", function(d) {
            return chart.heightForBar(chart.y, d);
          });
    }

    function onBarsExitTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(chart.timestamp(d.open_time)) - 0.5; })
          .remove();
    }
    function barsDataBind(data) {
      return this.selectAll("rect.volume")
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
  }
});
