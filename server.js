const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise-native');
//const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var parseString = require('xml2js').parseString;
const hbs = require('hbs');

app.use(express.static('public'));
app.set('view engine', 'hbs');

app.get('/', async function(req, res) {
  
  var xml = await rp('http://web.mta.info/status/serviceStatus.txt')
  var json = parseString(xml, (err, result) => {
    if (!err) {
      
      const subwayData = result.service.subway[0].line;
                                  
      const lines = {
        '123': {
          hex: '#EE352E',
          color: 'white'
        },
        '456': {
          hex: '#00933C',
          color: 'white'
        },
        '7': {
          hex: '#B933AD',
          color: 'white'
        },
        'ACE': {
          hex: '#0039A6',
          color: 'white'
        },
        'BDFM': {
          hex: '#FF6319',
          color: 'white'
        },
        'G': {
          hex: '#6CBE45',
          color: 'white'
        },
        'JZ': {
          hex: '#996633',
          color: 'white'
        },
        'L': {
          hex: '#A7A9AC',
          color: 'white'
        },
        'NQR': {
          hex: '#FCCC0A',
          color: 'black'
        },
        'S': {
          hex: '#808183',
          color: 'white'
        },
        'SIR': {
          hex: '#0039A6',
          color: 'white'
        }
      }
      
      const statuses = {
        'GOOD SERVICE': '😍',
        'SOME DELAYS': '😠',
        'DELAYS': '😡',
        'SLOW SPEEDS': '😔',
        'PLANNED WORK': '🤕',
        'LOCAL TO EXPRESS': '😳',
        'EXPRESS TO LOCAL': '🧐',
        'PART SUSPENDED': '😶',
        'TRAINS REROUTED': '🤔',
        'SUSPENDED': '🥶',
        'MULTIPLE IMPACTS': '🤯',
        'NO SCHEDULED SERVICE': '👻',
        'ESSENTIAL SERVICE': '😷',
        'STATIONS SKIPPED': '🤫',
        'WEEKDAY SERVICE': '🥺',
        'WEEKEND SERVICE': '😴',
        'CROWDING': '🥵'
      }
      
      subwayData.map(i => {
        lines[i.name[0]].status = i.status
        lines[i.name[0]].name = i.name[0]
      })
      
      for (var i in lines) {
        console.log(i, lines[i].status);
        lines[i].emoji = statuses[lines[i].status]
      }
      
      
      res.render('index', {lines: lines})
      
      
    } else {
      res.send("Error")
    }
  }); 
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
