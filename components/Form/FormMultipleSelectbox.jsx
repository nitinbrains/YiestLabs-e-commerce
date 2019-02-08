import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

const MenuProps = {
    PaperProps: {
        style: {
            border: "1px solid #FF9933"
        }
    }
};

class FormMultipleSelectbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options || []
        };
    }

    render() {
        let options = this.props.options || [];
        let { classes } = this.props;
        return (
            <Select
                multiple
                value={this.props.value}
                onChange={this.props.onChange}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={{ classes: { paper: classes.dropdownStyle } }}
                className={this.props.className}
                MenuProps={MenuProps}
                style={{
                    width: "100%",
                    border: "1px solid #FF9933"
                }}
            >
                {this.props.options.map(option => (
                    <MenuItem key={option.label} value={option.value}>
                        <Checkbox checked={this.props.value.indexOf(option.value) > -1} />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

const styles = theme => ({
    dropdownStyle: {
        border: "1px solid black",
        marginTop: "20px",
        width: "100%"
    }
});

FormMultipleSelectbox.propTypes = {
    value: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(FormMultipleSelectbox);
