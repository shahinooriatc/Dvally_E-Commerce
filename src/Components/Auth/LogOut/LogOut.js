import React, { Component } from 'react';
import { auth, signOut } from "../../firebaseCon";


class LogOut extends Component {
    handleLogOut = () => {
        signOut(auth).then(() => {
            console.log('Sign-out successful.');
        }).catch((error) => {
            // An error happened.
        });
    };

    render() {
        return (
            <h6 style={{color:'red'}}>
                <p onClick={this.handleLogOut}>LogOut</p>
            </h6>
        )
    }
}

export default LogOut;