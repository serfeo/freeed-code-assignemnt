import React from "react";

import Service from "../service/Service";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

class StopsSearcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stops: [],
      stopName: '',
      selectedStop: {},
    }
  }

  prettyStopName(stop) {
    let name = stop.name;
    if (stop.code) {
      name = name + ' (' + stop.code + ')';
    }

    return name;
  }

  handleStopNameChange(e) {
    if (e) {
      this.setState({'stopName': e.target.value ? e.target.value : ''}, function () {
        this.updateStops();
      });
    }
  }

  updateStops() {
    const that = this;
    if (this.state.stopName.length > 0) {
      Service.requestStops(this.state.stopName, function(response) {
        that.setState({'stops': response.data.stops});
      });
    } else {
      this.setState({'stops': []});
    }
  }

  handleSelectedStopChange(e, value) {
    if (value) {
      let route = this.props.route;
      route.to.position = [value.lat, value.lon];
      route.to.label = this.prettyStopName(value);

      const newState = {
        'selectedStop': value,
        'stopName': this.prettyStopName(value),
      };

      this.setState(newState, function() {
        this.props.updateRoute(route);
      });
    } else {
      this.setState({'stops': [], 'selectedStop': {}});
    }
  }

  compareOptionAndValue(option, value) {
    return this.prettyStopName(option) === this.prettyStopName(value);
  }

  render() {
    return (
      <Autocomplete
        className='stop-input'
        options={this.state.stops}
        value={this.state.selectedStop}
        onChange={(e, value) => this.handleSelectedStopChange(e, value)}
        inputValue={this.state.stopName}
        onInputChange={(e) => this.handleStopNameChange(e)}
        getOptionLabel={(option) => option.name ? this.prettyStopName(option) : ''}
        getOptionSelected={(option, value) => this.compareOptionAndValue(option, value)}
        renderInput={(params) =>
          <TextField
            {...params}
            label='Start entering stop name...'
            variant='outlined' />}
      />
    )
  }
}

export default StopsSearcher;