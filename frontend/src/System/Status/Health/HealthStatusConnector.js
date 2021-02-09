import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';
import { fetchHealth } from 'Store/Actions/systemActions';
import createHealthCheckSelector from 'Store/Selectors/createHealthCheckSelector';

function createMapStateToProps() {
  return createSelector(
    (state) => state.app,
    createHealthCheckSelector(),
    (state) => state.system.health,
    (app, items, health) => {
      return {
        isConnected: app.isConnected,
        isReconnecting: app.isReconnecting,
        isPopulated: health.isPopulated,
        errors: items.filter((item) => item.type === 'error').length,
        warnings: items.filter((item) => item.type === 'warning').length
      };
    }
  );
}

const mapDispatchToProps = {
  fetchHealth
};

class HealthStatusConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    if (!this.props.isPopulated) {
      this.props.fetchHealth();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isConnected && prevProps.isReconnecting) {
      this.props.fetchHealth();
    }
  }

  //
  // Render

  render() {
    return (
      <PageSidebarStatus
        {...this.props}
      />
    );
  }
}

HealthStatusConnector.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isReconnecting: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  fetchHealth: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(HealthStatusConnector);
