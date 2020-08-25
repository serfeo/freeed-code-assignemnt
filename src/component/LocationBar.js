import React from "react";

import SwapVertIcon from "@material-ui/icons/SwapVert";

class LocationBar extends React.Component {
  render() {
    return (
      <div className='search-wrapper'>
        <p className='subtitle'>From:</p>
        {this.props.getFrom().label}

        <SwapVertIcon
          onClick={this.props.handleSwap}
          className='swap-icon'/>

        <p className='subtitle'>To:</p>
        {this.props.getTo().label}
      </div>
    )
  }
}

export default LocationBar;