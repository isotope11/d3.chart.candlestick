/*! d3.chart.candlestick - v0.0.1
 *  License: MIT Expat
 *  Date: 2013-06-21
 */
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
      this.attr('class', 'candle')
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)); })
          .attr("y", function(d) {
            return chart.height() - chart.y(getStartingY(d));
          })
          .attr("width", (chart.width() - chart.margin.right) / length)
          .attr("height", function(d) {
            return getHeight(chart.y, d);
          })
          .attr("fill", colorForCandle)
          .attr("stroke", 'black');
    }

    function onWickEnter() {
      var length = this.data().length;
      this.attr('class', 'wick')
          .attr("x1", function(d, i) { return chart.x(timestamp(d.open_time)) + ((chart.width() - chart.margin.right) / length / 2); })
          .attr("x2", function(d, i) { return chart.x(timestamp(d.open_time)) + ((chart.width() - chart.margin.left) / length / 2); })
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
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)) - 0.5; });
    }

    function onTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)) - 0.5; });
    }

    function onExitTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(timestamp(d.open_time)) - 0.5; })
          .remove();
    }

    function getStartingTime(data){
      return d3.min(data.map(function(d){ return new Date(d.open_time); }));
    }

    function getClosingTime(data){
      return d3.max(data.map(function(d){ return new Date(d.open_time); }));
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

    function insert() {
      return this.insert("rect", "line");
    }

    function wickInsert() {
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
          .data(chart.x.ticks(10));
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
          .data(chart.y.ticks(10));
      },
      insert: function() {
        return this.insert("line")
            .attr('class', 'grid grid-y')
            .attr("x1", 0)
            .attr("x2", chart.width() - chart.margin.right)
            .attr("y1", chart.y)
            .attr("y2", chart.y)
            .attr("stroke", "#ccc");
      }
    });

    this.layer("grid-y-labels", this.base.append("g"), {
      dataBind: function(data){
        return this.selectAll("text.yLabel")
          .data(chart.y.ticks(10));
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

    this.layer("wicks", this.base.append("g").attr("class", "wicks"), {
      dataBind: wickDataBind,
      insert: wickInsert
    });

    this.layer("bars", this.base.append("g").attr("class", "bars"), {
      dataBind: dataBind,
      insert: insert
    });

    this.layer("info", this.base.append("g").attr("class", "info"), {
      dataBind: function() { return this.selectAll('rect').data([]); },
      insert: function(){
        return this.insert('text');
      }
    });

    this.layer("bars").on("enter", onEnter);
    this.layer("bars").on("enter:transition", onEnterTrans);
    this.layer("bars").on("update:transition", onTrans);
    this.layer("bars").on("exit:transition", onExitTrans);
    this.layer("wicks").on("enter", onWickEnter);

    var bisectDate = d3.bisector(function(d){
      return new Date(d.open_time).getTime() / 1000;
    }).left;

    this.base.on('mouseover', function(){
      var x0 = chart.x.invert(d3.mouse(this)[0]);
      var data = chart.layer('bars').selectAll('rect.candle').data();
      var i = bisectDate(data, x0, 1);
      var el = data[i];
      if(el){
        chart.layer("info")
          .append("rect")
          .attr("class", "info")
          .attr("width", 200)
          .attr("height", 200)
          .attr("x", 0)
          .attr("y", 0)
          .attr("fill", "white");
        var y = 20;
        [el.open_time,
         "Vol: " + el.volume,
         "Close: " + el.close,
         "Low: " + el.low,
         "Open: " + el.open,
         "High: " + el.high].forEach(function(d){
           chart.layer("info")
             .append('text')
             .attr('class', 'info')
             .text(d)
             .attr('y', y);
           y += 20;
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
      }
    });

    this.width(options.width || 600);
    this.height(options.height || 500);
    this.margin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 100
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
    this.x.domain([d3.min(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; })), d3.max(data.map(function(d){ return new Date(d.open_time).getTime() / 1000; }))])
      .range([0, this.width() - this.margin.right]);
    this.y.domain([d3.min(data.map(function(d){ return Number(d.low); })), d3.max(data.map(function(d){ return Number(d.high); }))]);
    return data;
  }
});
