import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

class PageContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { classes, theme } = this.props;
        return (            
            <div className={`${classes.container} ${this.props.className || ''}`} >
                <div className={classes.title}>
                    <Typography variant="h4" color="secondary">
                        {this.props.heading || '---Pass heading in props---'}
                    </Typography>
                </div>
                <Grid container spacing={24}>
                    {this.props.children}
                </Grid>
            </div>
        );
    }
}

const styles = theme => ({
    container: {
        marginTop: "50px",
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50
        },
        [theme.breakpoints.up("lg")]: {
            marginLeft: 100,
            marginRight: 100
        },
        [theme.breakpoints.up("xl")]: {
            marginLeft: 150,
            marginRight: 150
        }
    },
    title: {
        backgroundColor: "#FF9933",
        padding: 5,
        marginBottom: theme.spacing.unit * 4,
        textAlign: "center",
        marginLeft: theme.spacing.unit * -4,
        marginRight: theme.spacing.unit * -4
    },
    hide: {
        display: "none"
    },
    card: {
        position:'relative',
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    },
    image: {
        width: 170,
        marginRight: 10,
        textAlign: "center"
    },
    quantity: {
        width: 50,
        marginRight: 20
    }
});

PageContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PageContainer);
