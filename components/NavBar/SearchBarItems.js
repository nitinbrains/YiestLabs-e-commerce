import React, { Component } from "react";
import { connect } from "react-redux";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";


//custom
import Store from '../../lib/Store'

class SearchBarItems extends Component {

    selectMainCategory(mainIndex, category) {
        this.props.changeMainCategory(mainIndex, category);
    }

    selectSubCategory(mainIndex, subIndex, category) {
        this.props.changeSubCategory(mainIndex, subIndex, category);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {
                    this.props.store.categories.map((mainCategory, i) => {
                        return (
                            <div key={i}> 
                                <ListItem>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                onChange={() => this.selectMainCategory(i, mainCategory.value)}
                                                checked={mainCategory.checked}
                                            />
                                        }
                                        label={mainCategory.label}
                                    />
                                </ListItem>
                                {mainCategory.subCategories
                                ?
                                    <div className={mainCategory.checked ? null : classes.hide}>
                                    {
                                        mainCategory.subCategories.map((subCategory, j) => {
                                            return (
                                                <ListItem key={j}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                color="primary" 
                                                                onChange={() => this.selectSubCategory(i, j, subCategory.value)}
                                                                checked={subCategory.checked}
                                                            />
                                                        }
                                                        style={{ marginLeft: 10}}
                                                        label={subCategory.label}

                                                    />
                                                </ListItem>  
                                            )
                                        })
                                    }
                                    </div>
                                :
                                    null
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    }
});

const mapStateToProps = state => {
    return {
        store: state.store,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeMainCategory: (mainIndex, category) => dispatch({type: "MAIN_CATEGORY_CHANGE", mainIndex, category}),
        changeSubCategory: (mainIndex, subIndex, category) => dispatch({type: "SUB_CATEGORY_CHANGE", mainIndex, subIndex, category}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(SearchBarItems)));
