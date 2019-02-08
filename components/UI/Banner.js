import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { messageActions } from '../../redux/actions/messageActions';
import Alert from "./Alert";

class Banner extends React.Component {
    state = {
        
    };

    displayAlert = (messageList = []) => {
        let alert = []
        messageList.map((message, i) => {
            alert.push(
                <Alert key={i} message={message} />
            )
        })
        return alert;
    }
    render() {
        const { messages } = this.props;
        return (
            <React.Fragment>
                {this.displayAlert(messages.banner)}
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    close: {  },
});

Alert.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
    return {
        user: state.user,
        messages: state.messages,
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(messageActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Banner));
