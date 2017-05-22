import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

export default class NotificationBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.hasUpdated) {
      this.setState({open:new Date() - nextProps.hasUpdated  < 1000});
    }
  }

  render() {

    return (
      <Snackbar
        className="NotificationBar"
        open={this.state.open}
        message="Success! The pin has been updated."
        autoHideDuration={4000}
        onRequestClose={this.handleRequestClose}
      />
    );
  }
}