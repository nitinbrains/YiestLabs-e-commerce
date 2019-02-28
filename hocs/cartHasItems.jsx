import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from 'next/router';

export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                if( this.props.cart.items.length == 0 ){ // open store page if cart is empty
                    Router.push('/')
                }
            }
            render () {
                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ cart: state.cart }),
        dispatch => bindActionCreators({}, dispatch) 
    )(Wrapper());
}
