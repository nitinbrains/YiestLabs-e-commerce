import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import { orderActions } from "appRedux/actions/orderActions";
import LoadingScreen from 'components/UI/LoadingScreen';


export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                this.props.prepareOrder();
            }

            render () {
                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ 
            user: state.user,
            cart: state.cart,
            message: state.messages,
            order: state.order,
            loading: state.loading
         }),
        dispatch => bindActionCreators({ ...orderActions}, dispatch)
    )(Wrapper());
}
