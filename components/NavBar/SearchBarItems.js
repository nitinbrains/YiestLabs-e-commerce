import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { inventoryActions } from '../../redux/actions/inventoryActions';

class SearchBarItems extends Component {

    selectMainCategory(mainIndex, category) {
        this.props.changeCategory({ mainIndex, category });
    }

    selectSubCategory(mainIndex, subIndex, category) {
        this.props.changeCategory({ mainIndex, subIndex, category });
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
        store: state.inventory,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(inventoryActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withWidth()(withStyles(styles, { withTheme: true })(SearchBarItems)));
