import React, { Suspense, lazy } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import { userActions } from '../redux/actions/userActions';

export default (Component) => {
    const NewComponent = lazy(()=>(<Component />))
    const Wrapper = props => (
        class extends React.Component {
            render () {
                return (
                    <Suspense fallback={<div>Loading...</div>}>
                        <NewComponent {...this.props}/>
                    </Suspense>
                )
            }
        }
    )

    return connect(
        state => ({ user: state.user }),
        dispatch => bindActionCreators({...userActions}, dispatch) 
    )(Wrapper());
}
