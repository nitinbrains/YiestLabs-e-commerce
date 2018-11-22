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

    constructor(props) {
        super(props);
        this.state = {
            categories: [{
                label: "Yeast",
                value: 0,
                checked: true,
                subCategories: [{
                    label: "Ale Strains",
                    value: 1,
                    checked: true
                }, {
                    label: "Lager Strains",
                    value: 2,
                    checked: false
                }, {
                    label: "Wine/Mead/Cider Strains",
                    value: 3,
                    checked: false
                }, {
                    label: "Distilling Strains",
                    value: 4,
                    checked: false
                }, {
                    label: "Specialty/Belgian Strains",
                    value: 5,
                    checked: false
                }, {
                    label: "Wild Yeast & Bacteria Strains",
                    value: 6,
                    checked: false
                }, {
                    label: "Vault Strains",
                    value: 7,
                    checked: false
                }]
            }, {
                label: "Enzymes & Nutrients",
                value: 8,
                checked: false,
                subCategories: [{
                    label: "Enzymes",
                    value: 9,
                    checked: false
                }, {
                    label: "Nutrients",
                    value: 10,
                    checked: false
                }]
            }, {
                label: "Analytical Lab Services",
                value: 12,
                checked: false
            }, {
                label: "Lab Supplies",
                value: 13,
                checked: false
            }, {
                label: "Education",
                value: 14,
                checked: false
            }, {
                label: "Gift Shop",
                value: 15,
                checked: false
            }],
            selectedCategory: null
        };

    }

    /*
     * Change main category
     *
     * cannot unselect a category - can only switch to a new one
     */
    selectMainCategory = (mainIndex, category) => {

        var categories = this.state.categories;

        for(var i = 0; i < categories.length; i++) {

            if(i == mainIndex) {

                // main category already chosen, don't switch categories
                if(categories[mainIndex].checked) {
                    return;
                }
                else {
                    categories[mainIndex].checked = true;
                }
            }
            else {
                categories[i].checked = false;
                if(categories[i].subCategories) {
                    categories[i].subCategories.forEach((subCategory, j) => {
                        categories[i].subCategories[j].checked = false;
                    })
                }
            }
        }

        this.setState({categories: categories});
        this.props.changeCategory({category})

    }

    /*
     * Change sub category
     *
     * If subcategory is unselected, main category becomes category selected
     */
    selectSubCategory = (mainIndex, subIndex, category) => {

        var categories = this.state.categories;

        for(var i = 0; i < categories[mainIndex].subCategories.length; i++) {

            if(i == subIndex) {
                var toggle = true;

                // uncheck subcategory selection, select main category
                if(categories[mainIndex].subCategories[subIndex].checked) {
                    toggle = false
                    category = categories[mainIndex].value;
                }

                categories[mainIndex].subCategories[subIndex].checked = toggle;
            }
            else {
                categories[mainIndex].subCategories[i].checked = false;
            }
        }

        this.setState({categories: categories});
        this.props.changeCategory({category})
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {
                    this.state.categories.map((mainCategory, i) => {
                        return (
                            <div key={i}>
                                <ListItem>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                onChange={this.selectMainCategory.bind(this, i, mainCategory.value)}
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
                                                                onChange={this.selectSubCategory.bind(this, i, j, subCategory.value)}
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
