import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class LoadingScreen extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.content}>
                <div className={classes.loadingLogo}>
                    <CircularProgress
                        color="secondary"
                        thickness={1}
                        size={300}
                    />
                    <div className={classes.logo}>
                        <img
                            src="static/images/logo_loading.png"
                            height="300"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    content: {
        backgroundColor: "#f28411",
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0
    },
    loadingLogo: {
        position: "relative",
        margin: "auto",
        marginTop: '10%',
        textAlign:'center'
    },
    logo: {
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        top: 0,
    }
});

LoadingScreen.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoadingScreen);
