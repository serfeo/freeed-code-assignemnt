import React from "react";
import moment from "moment";

class Routes extends React.Component {
  prettyUTCTime(seconds) {
    return moment.utc(new Date(seconds)).format('HH:mm');
  }

  prettyTime(seconds) {
    return moment(new Date(seconds)).format('HH:mm');
  }

  generateLegInformation(leg) {
    if (leg.mode === 'WALK') {
      return <span>
        <sup className='time-upper'>[{this.prettyTime(leg.startTime)} - {this.prettyTime(leg.endTime)}]</sup>
        WALK, distance: {(leg.distance / 1000).toFixed(1)} km</span>
    } else {
      return <span>
        <sup className='time-upper'>[{this.prettyTime(leg.startTime)} - {this.prettyTime(leg.endTime)}]</sup>
        {leg.mode} {leg.route.shortName}, distance: {(leg.distance / 1000).toFixed(1)} km</span>
    }
  }

  generateTimeScheduleTable(leg) {
    if (leg.mode !== 'WALK' && leg.from && leg.from.stop && leg.from.stop.stoptimesForPatterns) {
      let times = []
      leg.from.stop.stoptimesForPatterns.forEach(item => {
        if (item.pattern.route.id === leg.route.id) {
          times = times.concat(item.stoptimes);
        }
      });

      return <div className='time-table'>
        <span className='timetable-title'>Timetable</span>
        <div>
          {times.map(time =>
            <span key={time.realtimeDeparture} className='time-item'>
              {this.prettyUTCTime(time.realtimeDeparture * 1000)}
            </span>
          )}
        </div>
      </div>
    }
  }

  render() {
    return (
      <div className='route-area-wrapper'>
        <span className='routes-subtitle'>Routes: </span>
        <div className='route-wrapper'>
          {this.props.routes.map((route, index) => (
            <div
              key={index}
              className={route === this.props.selectedRoute ? 'route-item-selected' : 'route-item'}
              onClick={(e) => this.props.handleRouteItemClick(route)}>
              {route.legs.map((leg, index) => (
                <div className='leg-item' key={index}>
                  {this.generateLegInformation(leg)}
                  {this.generateTimeScheduleTable(leg)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Routes;