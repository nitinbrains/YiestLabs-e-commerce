import React from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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

    handleClose = () => {
        this.setState({ visible: false });
    };

    render() {
        const { classes, children } = this.props;

        return (
            <React.Fragment>
                <div
                    className={classes.alert}
                    style={{
                        backgroundColor: this.state.color,
                        borderColor: this.setState.borderColor
                    }}
                >
                    <Typography variant="title" gutterBottom>
                        {this.props.message.details}
                    </Typography>
                    <div className={classes.close}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.props.closeMessage(this.props.index)}
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
    close: { position: "absolute", right: 0, top: 0 }
});

Alert.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        closeMessage: (index) => dispatch({type: "CLOSE_MESSAGE", index})
    };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Alert));
