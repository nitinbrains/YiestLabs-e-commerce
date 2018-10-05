import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class SearchBarItems extends React.Component {
    state = {
        checkedMain: null
    };

    handleMainCheck = i => () => {
        if (!this.state.checkedMain) {
            this.setState({ checkedMain: i });
        } else {
            this.setState({ checkedMain: null });
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                onChange={this.handleMainCheck(1)}
                            />
                        }
                        label="Yeast"
                    />
                </ListItem>
                <div className={!this.state.checkedMain == 1 && classes.hide}>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Ale Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Lager Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Wine/Mead/Cider Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Distilling Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Sepeciality/Belgian Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Wild Yeast & Bacteria Strains"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox color="primary" />}
                            style={{ marginLeft: 10 }}
                            label="Vault Strains"
                        />
                    </ListItem>
                </div>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Enzymes & Nutrients"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Analytical Lab Services"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Lab Supplies"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Education"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Gift Shop"
                    />
                </ListItem>
            </div>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    }
});

export default withStyles(styles, { withTheme: true })(SearchBarItems);
