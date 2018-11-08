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

class LoadingIndicator extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Dialog open={this.props.visible}>
                    <DialogContent>
                        <div className={classes.progress}>
                            <CircularProgress size={50} />
                        </div>

                        <Typography
                            variant="title"
                            style={{
                                textAlign: "center"
                            }}
                            gutterBottom
                        >
                            {this.props.label}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    progress: {
        margin: theme.spacing.unit * 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

LoadingIndicator.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoadingIndicator);
