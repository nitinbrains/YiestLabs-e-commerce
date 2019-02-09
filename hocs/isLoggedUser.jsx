import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import { userActions } from '../redux/actions/userActions';

export default (Component) => {
    const checkLoginAndRedirect = (userInfo) => {
        if( !userInfo.isLoggedin ){
            console.log('HOC - user is not logged in, opening login page')
            Router.push('/login')
        }
    }
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                checkLoginAndRedirect(this.props.user)
            }
            componentWillReceiveProps(nextProps){
                checkLoginAndRedirect(nextProps.user)
            }
            render () {

                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ user: state.user }),
        dispatch => bindActionCreators({...userActions}, dispatch) 
    )(Wrapper());
}
