import React from 'react';
import PropTypes from 'prop-types';
import {isEqual} from "lodash";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider, withSnackbar } from 'notistack';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});
const defaultAnchorOrigin  = {vertical: 'top',horizontal: 'center'};

class App extends React.Component {
  state = {
    showError:false
}
componentWillReceiveProps(props){
    if(!isEqual(props.messages, this.props.messages)){
        this.setState({showError:true})
    } else {
        this.setState({showError:false})
    }
}
  handleNotification = () => {
    const { messages } = this.props;
    if(messages.length > 0) {
      return messages.map((msg)=>{
          if(msg.variant === 'error') console.error('Error: ', msg.message)
          let options = {
            variant: msg.variant, 
            anchorOrigin: msg.anchorOrigin || defaultAnchorOrigin,
            autoHideDuration: msg.timeOut || 15000,
          }
          this.props.enqueueSnackbar( msg.message, options);
      })
    }
  }

  render() {
    return(
      <div>
        {this.state.showError && this.handleNotification()}
      </div>
    );
  }
}

App.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

const Notification = withSnackbar(App);


class SimpleSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event) => {
    this.props.handleClose()
  };

  

  render() {
    const { classes, messageList } = this.props;
    return (
      <div>
        <SnackbarProvider 
          maxSnack={5}
          onClose={this.handleClose}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={(e)=>{this.handleClose()}}
            >
              <CloseIcon />
            </IconButton>
          ]}
        >
          <Notification messages={messageList} />
        </SnackbarProvider>
      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);