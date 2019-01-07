import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import { userActions } from '../redux/actions/userActions';

export default (Component) => {
    const Wrapper = props => (
        class extends React.Component {
            componentWillMount() {
                if( this.props.user.email == '' ){ // treating user is not logged in if email is empty
                    console.log('HOC - user is not logged in, opening login page')
                    Router.push('/login')
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
    )(Wrapper());
}
