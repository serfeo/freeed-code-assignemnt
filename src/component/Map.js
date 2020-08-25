import React from "react";

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet'

import decodePolyline from "decode-google-map-polyline";
import {latLngBounds} from "leaflet";

class MapWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRouteParts: [],
      bounds: latLngBounds([[60.169383, 24.9236575], [60.169383, 24.9236575]])
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedRoute !== this.props.selectedRoute) {
      let selectedRouteParts = [];

      if (this.props.selectedRoute.legs) {
        selectedRouteParts = this.getSelectedRouteParts();
      }

      this.setState({
        'selectedRouteParts': selectedRouteParts,
        'bounds': latLngBounds([this.props.getFrom().position, this.props.getTo().position])
      });
    }
  }

  handleClick(e) {
    if (this.props.loading) { return; }

    let route = this.props.route;
    route.to.position = [e.latlng.lat, e.latlng.lng];
    route.to.label = 'Selected location';

    this.props.updateRoute(route);
  }

  randomColorPart() {
    return Math.floor(Math.random() * 130)
  }

  randDarkColor() {
    return 'rgb(' + this.randomColorPart() + ', ' + this.randomColorPart() + ', ' + this.randomColorPart() + ')';
  }

  getSelectedRouteParts() {
    let selectedRouteParts = [];
    this.props.selectedRoute.legs.forEach(leg => {
      let routePart = [];

      if (leg.legGeometry && leg.legGeometry.points) {
        const points = decodePolyline(leg.legGeometry.points);
        points.forEach(point => routePart.push([point.lat, point.lng]));
      }

      selectedRouteParts.push({
        'points': routePart,
        'color': this.randDarkColor(),
        'dashArray': leg.mode === 'WALK' ? '5, 10' : '',
        'description': leg.route ? (leg.mode + ' ' + leg.route.shortName + ' (' + leg.route.longName + ')') : ''
      });
    });

    return selectedRouteParts;
  }


  initMarker(ref) {
    if (ref) { ref.leafletElement.openPopup(); }
  }

  render() {
    return (
      <Map
        onClick={(e) => this.handleClick(e)}
        className='map'
        bounds={this.state.bounds}
        zoom={14}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
        />
        <Marker ref={this.initMarker} position={this.props.route.from.position}>
          <Popup>{this.props.route.from.label}</Popup>
        </Marker>
        {(!this.props.loading && this.props.route.to.position.length > 0) &&
        <Marker position={this.props.route.to.position}>
          <Popup>{this.props.route.to.label}</Popup>
        </Marker>
        }
        {!this.props.loading && this.state.selectedRouteParts.map((part, index) => (
          <Polyline
            key={index}
            positions={part.points}
            color={part.color}
            dashArray={part.dashArray}
            weight={5}>
            {part.description && <Popup>{part.description}</Popup>}
          </Polyline>
        ))}
      </Map>
    )
  }
}

export default MapWrapper;