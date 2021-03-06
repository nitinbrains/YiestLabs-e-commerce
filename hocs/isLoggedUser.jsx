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
    const checkLoginAndRedirect = (userInfo, router) => {
        if( !userInfo.id && !routeIgnoreList.includes(router.pathname) ){
            routeList.includes(router.pathname) ? Router.push('/') : Router.push('/login')
        }
    }
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                checkLoginAndRedirect(this.props.user, this.props.router)
            }
            componentWillReceiveProps(nextProps){
                checkLoginAndRedirect(nextProps.user, nextProps.router)
            }
            render () {
                let {user} = this.props;
                if( !user.id && !routeIgnoreList.includes(Router.pathname) ){
                    return <LoadingScreen />
                }

                return <Component {...this.props}/>
            }
        }
    )

    return connect(
        state => ({ user: state.user }),
        dispatch => bindActionCreators({...userActions}, dispatch)
    )(withRouter(Wrapper()));
}
