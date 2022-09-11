const express = require("express");
const app = express();
const request = require("request");
const rp = require("request-promise-native");
//const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var parseString = require("xml2js").parseString;
const hbs = require("hbs");

app.use(express.static("public"));
app.set("view engine", "hbs");

app.get("/", async function (req, res) {
  var xml = await rp("http://web.mta.info/status/serviceStatus.txt");
  var json = parseString(xml, (err, result) => {
    if (!err) {
      const subwayData = result.service.subway[0].line;

      const lines = {
        123: {
          lineNames: ["1", "2", "3"],
          hex: "#EE352E",
          color: "white",
        },
        456: {
          lineNames: ["4", "5", "6"],
          hex: "#00933C",
          color: "white",
        },
        7: {
          lineNames: ["7"],
          hex: "#B933AD",
          color: "white",
        },
        ACE: {
          lineNames: ["A", "C", "E"],
          hex: "#0039A6",
          color: "white",
        },
        BDFM: {
          lineNames: ["B", "D", "F", "M"],
          hex: "#FF6319",
          color: "white",
        },
        G: {
          lineNames: ["G"],
          hex: "#6CBE45",
          color: "white",
        },
        JZ: {
          lineNames: ["J", "Z"],
          hex: "#996633",
          color: "white",
        },
        L: {
          lineNames: ["L"],
          hex: "#A7A9AC",
          color: "white",
        },
        NQR: {
          lineNames: ["N", "Q", "R"],
          hex: "#FCCC0A",
          color: "black",
        },
        S: {
          lineNames: ["S"],
          hex: "#808183",
          color: "white",
        },
        SIR: {
          lineNames: ["SIR"],
          hex: "#0039A6",
          color: "white",
        },
      };

      const statuses = {
        "GOOD SERVICE": "😍",
        "SOME DELAYS": "😠",
        DELAYS: "😡",
        "SLOW SPEEDS": "😔",
        "PLANNED WORK": "🤕",
        "LOCAL TO EXPRESS": "😳",
        "EXPRESS TO LOCAL": "🧐",
        "PART SUSPENDED": "😶",
        "TRAINS REROUTED": "🤔",
        SUSPENDED: "🥶",
        "MULTIPLE IMPACTS": "🤯",
        "NO SCHEDULED SERVICE": "👻",
        "ESSENTIAL SERVICE": "😷",
        "STATIONS SKIPPED": "🤫",
        "WEEKDAY SERVICE": "🥺",
        "WEEKEND SERVICE": "😴",
        CROWDING: "🥵",
        "BOARDING CHANGE": "🤪",
      };

      subwayData.forEach((i) => {
        console.log(i.name, i.status);
        lines[i.name[0]].status = i?.status[0]?.split(" - ").reverse()[0];
        lines[i.name[0]].name = i.name[0].split("");
      });

      for (var i in lines) {
        console.log("status:", i, lines[i].status);
        lines[i].emoji = statuses[lines[i].status];
      }

      res.render("index", {
        lines: lines,
      });
    } else {
      res.send("Error");
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
