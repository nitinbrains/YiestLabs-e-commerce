import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import DoneIcon from "@material-ui/icons/Done";

import { messageActions } from 'appRedux/actions/messageActions';
/* Usage

Types: info (blue), error(red), success(green)
Send Visible prop
Wrap message

Example:
    <Alert visible type={'error'}>
        Sorry, we couldn't load inventory at this time. Please, come back later.
    </Alert>

*/
class Alert extends React.Component {
    state = {
        color: null,
        borderColor: null,
    };

    componentDidMount() {
        switch (this.props.message.type) {
            case "info":
                this.setState({
                    color: "rgb(185, 210, 235)",
                    borderColor: "rgb(5, 89, 172)"
                });
                break;
            case "error":
                this.setState({
                    color: "rgb(213, 51, 51)",
                    borderColor: "rgb(127, 25, 25)"
                });
                break;
            case "success":
                this.setState({
                    color: "rgb(94, 208, 81)",
                    borderColor: "rgb(45, 132, 36)"
                });
                break;
        }
    }

    handleClose = (index) => {
        this.props.hideBanner({index})
    }

    render() {
        const { classes, children, error, message } = this.props;
        let _classname = classes.error;
        let _icon = <ErrorIcon />
        if(message.variant === 'error'){
        } else if(message.variant === 'success'){
            _classname = classes.success;
            _icon = <DoneIcon />
            setTimeout(()=>{
                this.handleClose(message.index)
            },message.timeOut || 30000)
        }else if(message.variant === 'info'){
            _classname = classes.info;
            _icon = <ErrorIcon />
        } else if(message.variant === 'permanentSuccess'){
              _classname = classes.success;
              _icon = <DoneIcon />
        }
        return (
            <React.Fragment>
                <div
                    className={_classname}
                    style={{
                        backgroundColor: this.state.color,
                        borderColor: this.setState.borderColor
                    }}
                >
                    <div className="alert-message">
                        {_icon}
                        <span>{message.message}</span>
                    </div>
                    <div className={classes.close}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.handleClose(message.index)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    alert: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 5,
        borderRadius: 3,
        width: "100%",
        position: "relative"
    },
    close: {  },
    error: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 3,
        width: "100%",
        position: "relative",
        background: "#f9dde0",
        color: "#b76a6d",
        border: "1px solid",
        display:"flex",
        justifyContent: 'space-between',
    },
    success: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 3,
        width: "100%",
        position: "relative",
        background: "rgba(0, 128, 0, 0.11)",
        color: "green",
        border: "1px solid",
        display:"flex",
        justifyContent: 'space-between',
    },
    info: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 3,
        width: "100%",
        position: "relative",
        background: "rgba(0, 0, 255, 0.13)",
        color: "rgba(0, 0, 255, 0.45)",
        border: "1px solid",
        display:"flex",
        justifyContent: 'space-between',
    }
});

Alert.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(messageActions, dispatch);

export default connect(null, mapDispatchToProps)(withStyles(styles)(Alert));
