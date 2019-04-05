// import React from 'react';
import React, { Suspense, lazy } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from 'next/router';


import LoadingScreen from 'components/UI/LoadingScreen';
import { withRouter } from 'next/router'
import { userActions } from 'appRedux/actions/userActions';

const routeList = ['/checkout']
const routeIgnoreList = ['/cart']

export default (Component) => {

    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                const orderComplete = sessionStorage.getItem('orderComplete');
                if (orderComplete == 'yes') {
                    Router.push('/');
                }
            }
 
            render () {
                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ user: state.user }),
        dispatch => bindActionCreators({...userActions}, dispatch)
    )(withRouter(Wrapper()));
}
