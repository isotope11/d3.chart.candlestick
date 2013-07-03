// datasrc.js
// A simple data source to feed the bar chart visualization. Based on the
// implementation in "A Bar Chart, part 2":
// http://mbostock.github.com/d3/tutorial/bar-2.html
(function(window, undefined) {

  "use strict";

  var d3 = window.d3;

  var DataSrc = window.DataSrc = function() {
    var self = this;
    this.last_open_time = new Date("2013-06-15T02:42:00-05:00");
    this.ema = (new EMAData()).data;
    this.bb = (new BBData()).data;
    this.data = [
          {
            "volume": "10.0",
            "close": "99.44916",
            "low": "98.62399",
            "high": "99.49999",
            "open": "98.62399",
            "open_time": "2013-06-15T01:26:00-05:00"
          },
          {
            "volume": "7.36",
            "close": "99.47013",
            "low": "98.62401",
            "high": "99.49998",
            "open": "99.44916",
            "open_time": "2013-06-15T01:28:00-05:00"
          },
          {
            "volume": "1.49752165",
            "close": "98.62399",
            "low": "98.62399",
            "high": "99.47013",
            "open": "99.47013",
            "open_time": "2013-06-15T01:30:00-05:00"
          },
          {
            "volume": "10.19",
            "close": "98.52002",
            "low": "98.52001",
            "high": "98.62404",
            "open": "98.62399",
            "open_time": "2013-06-15T01:31:00-05:00"
          },
          {
            "volume": "8.00941",
            "close": "98.52003",
            "low": "98.52",
            "high": "98.52003",
            "open": "98.52002",
            "open_time": "2013-06-15T01:32:00-05:00"
          },
          {
            "volume": "154.8905703",
            "close": "98.53",
            "low": "98.52002",
            "high": "99.52426",
            "open": "98.52003",
            "open_time": "2013-06-15T01:33:00-05:00"
          },
          {
            "volume": "1.74173314",
            "close": "99.20001",
            "low": "98.53",
            "high": "99.20001",
            "open": "98.53",
            "open_time": "2013-06-15T01:34:00-05:00"
          },
          {
            "volume": "153.27899429",
            "close": "98.53001",
            "low": "98.51",
            "high": "99.55888",
            "open": "99.20001",
            "open_time": "2013-06-15T01:35:00-05:00"
          },
          {
            "volume": "0.26498117",
            "close": "98.6",
            "low": "98.53",
            "high": "99.49893",
            "open": "98.53001",
            "open_time": "2013-06-15T01:36:00-05:00"
          },
          {
            "volume": "10.42039308",
            "close": "98.53",
            "low": "98.53",
            "high": "98.6",
            "open": "98.6",
            "open_time": "2013-06-15T01:37:00-05:00"
          },
          {
            "volume": "265.10741627",
            "close": "98.53",
            "low": "98.52003",
            "high": "98.99999",
            "open": "98.53",
            "open_time": "2013-06-15T01:38:00-05:00"
          },
          {
            "volume": "0.76809323",
            "close": "98.53",
            "low": "98.53",
            "high": "98.99999",
            "open": "98.53",
            "open_time": "2013-06-15T01:39:00-05:00"
          },
          {
            "volume": "4.6609964",
            "close": "99.22323",
            "low": "98.53",
            "high": "99.253",
            "open": "98.53",
            "open_time": "2013-06-15T01:40:00-05:00"
          },
          {
            "volume": "0.05109496",
            "close": "99.25398",
            "low": "99.22322",
            "high": "99.25398",
            "open": "99.22323",
            "open_time": "2013-06-15T01:41:00-05:00"
          },
          {
            "volume": "4.80555872",
            "close": "99.22323",
            "low": "99.22323",
            "high": "99.53999",
            "open": "99.25398",
            "open_time": "2013-06-15T01:42:00-05:00"
          },
          {
            "volume": "0.01",
            "close": "99.22323",
            "low": "99.22322",
            "high": "99.22323",
            "open": "99.22323",
            "open_time": "2013-06-15T01:43:00-05:00"
          },
          {
            "volume": "2.47697224",
            "close": "99.22322",
            "low": "99.22322",
            "high": "99.22323",
            "open": "99.22323",
            "open_time": "2013-06-15T01:45:00-05:00"
          },
          {
            "volume": "0.75597736",
            "close": "99.01334",
            "low": "98.55959",
            "high": "99.22323",
            "open": "99.22322",
            "open_time": "2013-06-15T01:46:00-05:00"
          },
          {
            "volume": "2.507",
            "close": "98.62419",
            "low": "98.62419",
            "high": "99.01334",
            "open": "99.01334",
            "open_time": "2013-06-15T01:48:00-05:00"
          },
          {
            "volume": "0.02441687",
            "close": "98.62418",
            "low": "98.62418",
            "high": "98.62419",
            "open": "98.62419",
            "open_time": "2013-06-15T01:49:00-05:00"
          },
          {
            "volume": "0.2",
            "close": "98.62419",
            "low": "98.62418",
            "high": "98.62419",
            "open": "98.62418",
            "open_time": "2013-06-15T01:50:00-05:00"
          },
          {
            "volume": "2.25615371",
            "close": "98.62418",
            "low": "98.62418",
            "high": "98.99999",
            "open": "98.62419",
            "open_time": "2013-06-15T01:52:00-05:00"
          },
          {
            "volume": "0.00019366",
            "close": "98.62419",
            "low": "98.62418",
            "high": "98.62419",
            "open": "98.62418",
            "open_time": "2013-06-15T01:53:00-05:00"
          },
          {
            "volume": "2.36445298",
            "close": "98.62419",
            "low": "98.62418",
            "high": "98.62419",
            "open": "98.62419",
            "open_time": "2013-06-15T01:54:00-05:00"
          },
          {
            "volume": "24.78",
            "close": "98.5606",
            "low": "98.5101",
            "high": "98.62419",
            "open": "98.62419",
            "open_time": "2013-06-15T01:55:00-05:00"
          },
          {
            "volume": "5.00500942",
            "close": "99.19899",
            "low": "98.5606",
            "high": "99.22419",
            "open": "98.5606",
            "open_time": "2013-06-15T01:56:00-05:00"
          },
          {
            "volume": "1.07040045",
            "close": "99.35",
            "low": "99.19442",
            "high": "99.35",
            "open": "99.19899",
            "open_time": "2013-06-15T01:57:00-05:00"
          },
          {
            "volume": "0.41867108",
            "close": "99.14485",
            "low": "99.14485",
            "high": "99.35",
            "open": "99.35",
            "open_time": "2013-06-15T02:00:00-05:00"
          },
          {
            "volume": "6.74271565",
            "close": "99.5",
            "low": "99.0",
            "high": "99.5",
            "open": "99.14485",
            "open_time": "2013-06-15T02:01:00-05:00"
          },
          {
            "volume": "0.00047975",
            "close": "99.51013",
            "low": "99.5",
            "high": "99.51013",
            "open": "99.5",
            "open_time": "2013-06-15T02:02:00-05:00"
          },
          {
            "volume": "12.52948959",
            "close": "98.77781",
            "low": "98.7778",
            "high": "99.51013",
            "open": "99.51013",
            "open_time": "2013-06-15T02:03:00-05:00"
          },
          {
            "volume": "0.7658",
            "close": "98.56001",
            "low": "98.54",
            "high": "99.50904",
            "open": "98.77781",
            "open_time": "2013-06-15T02:04:00-05:00"
          },
          {
            "volume": "19.18519759",
            "close": "98.58",
            "low": "98.56001",
            "high": "99.58298",
            "open": "98.56001",
            "open_time": "2013-06-15T02:05:00-05:00"
          },
          {
            "volume": "2.99597427",
            "close": "99.55309",
            "low": "98.56511",
            "high": "99.55309",
            "open": "98.58",
            "open_time": "2013-06-15T02:06:00-05:00"
          },
          {
            "volume": "0.04470103",
            "close": "99.52318",
            "low": "99.52309",
            "high": "99.55309",
            "open": "99.55309",
            "open_time": "2013-06-15T02:07:00-05:00"
          },
          {
            "volume": "3.358",
            "close": "99.50001",
            "low": "99.5",
            "high": "99.52318",
            "open": "99.52318",
            "open_time": "2013-06-15T02:08:00-05:00"
          },
          {
            "volume": "0.00057267",
            "close": "99.47999",
            "low": "99.47999",
            "high": "99.50001",
            "open": "99.50001",
            "open_time": "2013-06-15T02:09:00-05:00"
          },
          {
            "volume": "2.613",
            "close": "98.55001",
            "low": "98.55001",
            "high": "99.47999",
            "open": "99.47999",
            "open_time": "2013-06-15T02:10:00-05:00"
          },
          {
            "volume": "6.06800707",
            "close": "98.57998",
            "low": "98.55001",
            "high": "99.47999",
            "open": "98.55001",
            "open_time": "2013-06-15T02:11:00-05:00"
          },
          {
            "volume": "2.38445942",
            "close": "98.54111",
            "low": "98.53908",
            "high": "98.57998",
            "open": "98.57998",
            "open_time": "2013-06-15T02:12:00-05:00"
          },
          {
            "volume": "2.603",
            "close": "98.56069",
            "low": "98.54111",
            "high": "98.56069",
            "open": "98.54111",
            "open_time": "2013-06-15T02:13:00-05:00"
          },
          {
            "volume": "0.02",
            "close": "99.19",
            "low": "98.56069",
            "high": "99.2073",
            "open": "98.56069",
            "open_time": "2013-06-15T02:14:00-05:00"
          },
          {
            "volume": "1.3032071",
            "close": "98.57",
            "low": "98.57",
            "high": "99.19",
            "open": "99.19",
            "open_time": "2013-06-15T02:18:00-05:00"
          },
          {
            "volume": "13.109456",
            "close": "98.54112",
            "low": "98.535",
            "high": "98.56998",
            "open": "98.56997",
            "open_time": "2013-06-15T02:21:00-05:00"
          },
          {
            "volume": "40.12662549",
            "close": "98.53001",
            "low": "98.53",
            "high": "98.55",
            "open": "98.54112",
            "open_time": "2013-06-15T02:22:00-05:00"
          },
          {
            "volume": "7.55073742",
            "close": "99.01278",
            "low": "98.5101",
            "high": "99.01278",
            "open": "98.53001",
            "open_time": "2013-06-15T02:23:00-05:00"
          },
          {
            "volume": "1.79499103",
            "close": "98.9831",
            "low": "98.5101",
            "high": "99.0128",
            "open": "99.01278",
            "open_time": "2013-06-15T02:24:00-05:00"
          },
          {
            "volume": "0.01",
            "close": "99.0128",
            "low": "98.9831",
            "high": "99.0128",
            "open": "98.9831",
            "open_time": "2013-06-15T02:25:00-05:00"
          },
          {
            "volume": "0.01",
            "close": "99.01279",
            "low": "99.01279",
            "high": "99.0128",
            "open": "99.0128",
            "open_time": "2013-06-15T02:26:00-05:00"
          },
          {
            "volume": "4.0",
            "close": "99.01279",
            "low": "99.01279",
            "high": "99.19",
            "open": "99.01279",
            "open_time": "2013-06-15T02:28:00-05:00"
          },
          {
            "volume": "0.01",
            "close": "99.01279",
            "low": "99.01279",
            "high": "99.01279",
            "open": "99.01279",
            "open_time": "2013-06-15T02:29:00-05:00"
          },
          {
            "volume": "0.02277941",
            "close": "99.19",
            "low": "99.01279",
            "high": "99.19",
            "open": "99.01279",
            "open_time": "2013-06-15T02:30:00-05:00"
          },
          {
            "volume": "3.48054226",
            "close": "99.29973",
            "low": "99.19",
            "high": "99.29973",
            "open": "99.19",
            "open_time": "2013-06-15T02:31:00-05:00"
          },
          {
            "volume": "1.2018",
            "close": "99.66",
            "low": "99.29973",
            "high": "99.66",
            "open": "99.29973",
            "open_time": "2013-06-15T02:32:00-05:00"
          },
          {
            "volume": "8.55945774",
            "close": "99.19",
            "low": "99.19",
            "high": "99.66",
            "open": "99.66",
            "open_time": "2013-06-15T02:34:00-05:00"
          },
          {
            "volume": "6.03254768",
            "close": "98.70002",
            "low": "98.70002",
            "high": "99.51",
            "open": "99.19",
            "open_time": "2013-06-15T02:35:00-05:00"
          },
          {
            "volume": "0.01",
            "close": "99.51",
            "low": "98.70002",
            "high": "99.51",
            "open": "98.70002",
            "open_time": "2013-06-15T02:37:00-05:00"
          },
          {
            "volume": "0.523",
            "close": "98.70005",
            "low": "98.70005",
            "high": "99.51",
            "open": "99.51",
            "open_time": "2013-06-15T02:38:00-05:00"
          },
          {
            "volume": "0.49295477",
            "close": "99.51",
            "low": "98.70005",
            "high": "99.51",
            "open": "98.70005",
            "open_time": "2013-06-15T02:39:00-05:00"
          },
          {
            "volume": "0.5",
            "close": "98.71512",
            "low": "98.71512",
            "high": "99.51",
            "open": "99.51",
            "open_time": "2013-06-15T02:40:00-05:00"
          },
          {
            "volume": "0.01035822",
            "close": "99.48015",
            "low": "98.71512",
            "high": "99.48015",
            "open": "98.71512",
            "open_time": "2013-06-15T02:41:00-05:00"
          },
          {
            "volume": "2.55194397",
            "close": "98.7152",
            "low": "98.7152",
            "high": "99.51",
            "open": "99.48015",
            "open_time": "2013-06-15T02:42:00-05:00"
          }
        ];
  };

  DataSrc.prototype.alertStupidData = function() {
    var isDumb = function(d){
      return highIsntHigh(d) || lowIsntLow(d);
    };

    var highIsntHigh = function(d) {
      var high = Number(d.high);
      return (high < Number(d.low))
        || (high < Number(d.close))
        || (high < Number(d.open));
    }

    var lowIsntLow = function(d) {
      var low = Number(d.low);
      return (low > Number(d.high))
        || (low > Number(d.close))
        || (low > Number(d.open));
    }

    this.data.forEach(function(d){
      if(isDumb(d)){
        console.log("Stupid data: ", d);
      }
    });
  };

  DataSrc.prototype.add = function() {
    // Add a minute to the last open time
    this.last_open_time = new Date(this.last_open_time.getTime() + (1 * 60000));
    console.log(this.last_open_time);
    var data = {
      "volume": "0.42950446",
      "close": "99.40113",
      "low": "99.40113",
      "high": "99.40116",
      "open": "99.40114",
      "open_time": this.last_open_time.toISOString()
      //"open_time": "2013-06-15T02:43:00-05:00"
    };
    this.data.shift();
    this.data.push(data);
  };

  DataSrc.prototype.randomizeLastClosePrice = function() {
    var lastDatum = this.data[this.data.length-1];
    var newLastClosePrice = Number(lastDatum.close) - (0.5 - Math.random() * 1);
    lastDatum.close = String(newLastClosePrice);
    if(Number(lastDatum.high) < newLastClosePrice){
      lastDatum.high = String(newLastClosePrice);
    }
    if(Number(lastDatum.low) > newLastClosePrice){
      lastDatum.low = String(newLastClosePrice);
    }
  }

}(this));
