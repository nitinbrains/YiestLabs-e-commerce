import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Router from 'next/router';
import _size from "lodash/size";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

class RemovedItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            acknowledged: false
        }
    }

    closeDialog = () => {
        this.setState({acknowledged: true});
    }

    backToStore = () => {
        this.setState({acknowledged: true})
        this.closeDialog();
        Router.push('/');
    }

    render() {
        const { acknowledged } = this.state;
        const { order: { removedItems }, cart: { items }, classes} = this.props;
        const allItemsRemoved = _size(removedItems) == _size(items);


        return (
            <Dialog
                open={_size(removedItems) && !acknowledged}
                maxWidth="md"
                fullWidth
            >
                <DialogContent id="removed-items">
                    <div className={classes.close}>
                        <IconButton style={{ padding: "4.5px" }} color="inherit" size="small" aria-label="Menu" onClick={() => this.handleDialogClose()}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {allItemsRemoved ?
                        <React.Fragment>
                            <div className="main-block">
                                <div className="order-number">
                                    <Typography variant="h6" color="textPrimary">
                                        Removed Items
                                    </Typography>
                                </div>
                                <Grid item>
                                    <Typography>All items have been removed</Typography>
                                </Grid>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={e => this.backToStore()}
                                    >
                                        Back to Store
                                    </Button>
                                </Grid>
                            </div>
                        </React.Fragment>
                    :
                        <React.Fragment>
                            <div className="main-block">
                                <div className="order-number">
                                    <Typography variant="h6" color="textPrimary">
                                        Removed Items
                                    </Typography>
                                </div>
                                <Grid container xs spacing={8} justify="center" alignItems="center">
                                        <React.Fragment>
                                            {removedItems.map((item) => {
                                                return (
                                                    <Grid item>
                                                        <Typography>
                                                            {item.Name}
                                                        </Typography>
                                                    </Grid>
                                                )
                                            })}
                                        </React.Fragment>
                                    }
                                </Grid>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={e => this.closeDialog()}
                                    >
                                        Acknowledge
                                    </Button>
                                </Grid>
                            </div>
                        </React.Fragment>
                    }

                </DialogContent>
            </Dialog>
        )
    }
}

const styles = theme => ({
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});
const mapStateToProps = state => {
    return {
        order: state.order,
        cart: state.cart
    };
};

export default connect(
    mapStateToProps,
    null
)(compose(withStyles(styles, { withTheme: true })(RemovedItems)));
