import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { forgotPassword } from "components/firebase/FirebaseLoginUtils";

export default class ForgotPassword extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onSubmit = () => {
        const { email } = this.state;
        forgotPassword(email)
        alert("A password reset email was sent to " + email )
        this.props.history.push("/loginpage")
    }

    onChange = (e) => {
        this.setState( {
            [e.target.name]: e.target.value
        })
    }

    render() {
        if(this.state.online){
          return <Redirect to = "/about"></Redirect>
        }
        return (
          <div style={{height: '100%'}}>
            <title>Login</title>
            <div className='bg-img'>
              <div className='content'>
                <header>Jewish Trail</header>
                <form onSubmit={(e)=>this.onSubmit(e)}>
                  <div className='field'>
                    <span className="fas fa-envelope"></span>
                    <input required name="email" onChange={this.onChange} type='email' placeholder='Email...'></input>
                  </div>
                  <div className='field space'>
                    <input type='submit' value='Reset Password'></input>
                  </div>
                  <div className='pass'>
                    <a href='/about'>Continue as a guest</a>
                  </div>
                  <div className='pass'>
                    Don't have an account?  
                    <a href="/signup">Sign up</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
    }
}