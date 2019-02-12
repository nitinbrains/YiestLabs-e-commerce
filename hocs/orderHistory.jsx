import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import { orderActions } from "appRedux/actions/orderActions";


export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                this.props.getOrderHistory();
            }

            render () {
                {this.props.user.isLoading 
                ?
                    
                :
                    return <Component {...this.props}/>
                }
                
            }
        }
    )

    return connect(
        state => ({ 
            user: state.user,
            cart: state.cart,
            message: state.messages,
            order: state.order
         }),
        dispatch => bindActionCreators({ ...orderActions}, dispatch)
    )(Wrapper());
}
