import React from 'react';

import LocationBar from './component/LocationBar';
import Routes from './component/Routes';
import StopsSearcher from './component/StopsSearcher';
import MapWrapper from './component/Map';

import CircularProgress from "@material-ui/core/CircularProgress";

import './App.css';
import Service from './service/Service';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      route: {
        from: {
          position: [60.169383, 24.9236575],
          label: <span>Eficode headquarters<br/> Pohjoinen Rautatiekatu 25</span>
        },
        to: {
          position: [],
          label: 'Choose a location on map'
        },
        reversed: false
      },
      loading: false,
      routes: [],
      selectedRouteParts: [],
      selectedRoute: {},
    };
  }

  handleSwap() {
    if (this.state.loading) { return; }

    let route = this.state.route;
    route.reversed = !route.reversed;
    this.setState({'route': route}, function() {
      if (route.to.position.length > 0 && route.from.position.length > 0) {
        this.requestRoutes(route);
      }
    });
  }

  getFrom() {
    return this.state.route.reversed ? this.state.route.to : this.state.route.from;
  }

  getTo() {
    return this.state.route.reversed ? this.state.route.from : this.state.route.to;
  }

  requestRoutes(route) {
    this.setState({loading: true}, function() {
      Service.requestRoutes(
        this.getFrom().position,
        this.getTo().position,
        ((response) => {this.handleRoutesResponse(response, route)})
    )});
  }

  handleRoutesResponse(response, route) {
    const routes = response.data.plan.itineraries;
    let selectedRoute = {};

    if (routes.length > 0) {
      selectedRoute = routes[0];
    }

    this.setState({
      'route': route,
      'loading': false,
      'routes': routes,
      'selectedRoute': selectedRoute
    });
  }

  handleRouteItemClick(route) {
    this.setState({'selectedRoute': route});
  }

  updateRoute(route) {
    this.setState({'route': route}, function() {
      this.requestRoutes(route);
    })
  }

  render() {
    return (
      <div className='app'>
        <StopsSearcher
          route={this.state.route}
          updateRoute={(route) => this.updateRoute(route)}/>
        {this.state.loading && <CircularProgress className='progress-bar'/>}

        <div className='info'>
          <div className='content'>
            <LocationBar
              getFrom={() => this.getFrom()}
              getTo={() => this.getTo()}
              handleSwap={() => this.handleSwap()}/>

            {(this.state.routes.length > 0 && !this.state.loading) &&
              <Routes
                routes={this.state.routes}
                selectedRoute={this.state.selectedRoute}
                handleRouteItemClick={(route) => this.handleRouteItemClick(route)}/>}

            {(this.state.routes.length === 0 && !this.state.loading && this.state.route.to.position.length > 0) &&
              <p className='empty-error-message'>No route was found. Please try another location.</p>}

          </div>
        </div>
        <MapWrapper
          route={this.state.route}
          loading={this.state.loading}
          selectedRoute={this.state.selectedRoute}
          getTo={() => this.getTo()}
          getFrom={() => this.getFrom()}
          updateRoute={(route) => this.updateRoute(route)}/>
      </div>
    )};
}

export default App;
