d3.chart("CandlestickChart", {
  initialize: function(options) {
    options = options || {};

    var chart = this;

    this.x = d3.scale.linear();

    this.y = d3.scale.linear();

    this.base
      .attr("class", "chart");

    function onEnter() {
      var length = this.data().length;
      this.attr("x", function(d, i) { return chart.x(timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.height() - chart.y(getStartingY(d));
          })
          .attr("width", chart.width() / length)
          .attr("height", function(d) {
            return getHeight(chart.y, d);
          })
          .attr("fill", colorForCandle)
          .attr("stroke", 'black');
    }

    function onWickEnter() {
      var length = this.data().length;
      this.attr('class', 'wick')
          .attr("x1", function(d, i) { return chart.x(timestamp(d.open_time)) + (chart.width() / length / 2); })
          .attr("x2", function(d, i) { return chart.x(timestamp(d.open_time)) + (chart.width() / length / 2); })
          .attr("y1", function(d) {
            return chart.height() - chart.y(Number(d.high));
          })
          .attr("y2", function(d) {
            return chart.height() - chart.y(Number(d.low));
          })
          .attr("width", 1)
          .attr('stroke', colorForCandle);
    }

    function onEnterTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)) - .5; });
    }

    function onTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)) - .5; });
    }

    function onExitTrans() {
      //this.duration(1000)
          //.attr("x", function(d, i) { return chart.x(i - 1) - .5; })
          //.remove();
    }

    function getStartingTime(data){
      return d3.min(data.map(function(d){ return new Date(d.open_time) }));
    }

    function getClosingTime(data){
      return d3.max(data.map(function(d){ return new Date(d.open_time) }));
    }

    function getStartingY(candle) {
      return Math.max(Number(candle.open), Number(candle.close));
    }

    function getHeight(y, candle) {
      return y(Math.max(Number(candle.open), Number(candle.close))) - y(Math.min(Number(candle.open), Number(candle.close)));
    }

    function dataBind(data) {
      return this.selectAll("rect.candle")
        .data(data, function(d) { return d.open_time; });
    }

    function wickDataBind(data) {
      return this.selectAll("line.wick")
        .data(data, function(d) { return d.open_time; });
    }

    function gridDataBind(data) {
    }

    function insert() {
      return this.insert("rect", "line");
    }

    function wickInsert() {
      return this.insert("line");
    }

    function gridInsert() {
      return this.insert("line");
    }

    function timestamp(dateString) {
      return new Date(dateString).getTime() / 1000;
    }

    function colorForCandle(candle) {
      return Number(candle.open) > Number(candle.close) ? "red" : "green";
    }

    this.layer("grid-x", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("line.grid.grid-x")
          .data(chart.x.ticks(10))
      },
      insert: function() {
        return this.insert("line")
            .attr('class', 'grid grid-x')
            .attr("x1", chart.x)
            .attr("x2", chart.x)
            .attr("y1", 0)
            .attr("y2", chart.height())
            .attr("stroke", "#ccc");
      }
    });
    this.layer("grid-y", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("line.grid.grid-y")
          .data(chart.y.ticks(10))
      },
      insert: function() {
        return this.insert("line")
            .attr('class', 'grid grid-y')
            .attr("x1", 0)
            .attr("x2", chart.width())
            .attr("y1", chart.y)
            .attr("y2", chart.y)
            .attr("stroke", "#ccc");
      }
    });

    this.layer("wicks", this.base.append("g"), {
      dataBind: wickDataBind,
      insert: wickInsert
    });

    this.layer("bars", this.base.append("g"), {
      dataBind: dataBind,
      insert: insert
    });

    this.layer("bars").on("enter", onEnter);
    this.layer("bars").on("enter:transition", onEnterTrans);
    this.layer("bars").on("update:transition", onTrans);
    this.layer("bars").on("exit:transition", onExitTrans);
    this.layer("wicks").on("enter", onWickEnter);
    this.width(options.width || 600);
    this.height(options.height || 500);

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
    this.x.domain([new Date("2013-06-15T00:42:00-05:00").getTime() / 1000, new Date("2013-06-15T02:42:00-05:00").getTime() / 1000]);
    this.y.domain([d3.min(data.map(function(d){ return Number(d.low); })), d3.max(data.map(function(d){ return Number(d.high); }))]);
    return data;
  }

});
