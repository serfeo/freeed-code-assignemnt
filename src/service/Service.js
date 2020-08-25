const requestRoutes = (locationFrom, locationTo, callback) => {
  fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    'method': 'POST',
    'headers': {'Content-Type': 'application/graphql'},
    'body': `{
      plan(
        from: {lat: ` + locationFrom[0] + `, lon: ` + locationFrom[1] + `}
        to: {lat: ` + locationTo[0] + `, lon: ` + locationTo[1] + `}
        numItineraries: 3
      ) {
      itineraries {
        legs {
          startTime
          endTime
          mode
          duration
          distance
          from {
            stop {
              name
              stoptimesForPatterns(startTime: 0, timeRange: 86400, numberOfDepartures: 100) {
                pattern {
                  route {
                    id
                  }
                }
                stoptimes {
                  realtimeDeparture
                }
              }
            }
          }
          legGeometry {
            length
            points
          }
          route {
            id
            shortName
            longName
          }
          steps {
            lon
            lat
          }
        }
      }
    }
  }`
  })
  .then(response => response.json())
  .then(response => callback(response))
  .catch(err => console.log(err));
}

const requestStops = (name, callback) => {
  fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    'method': 'POST',
    'headers': {'Content-Type': 'application/graphql'},
    'body': `{
      stops(name: "` + name + `") {
        name
        code
        lat
        lon
      }
    }`
  })
    .then(response => response.json())
    .then(response => callback(response))
    .catch(err => console.log(err));
}

const Service = {
  requestRoutes,
  requestStops
}

export default Service;