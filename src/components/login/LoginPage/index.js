import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signInWithGoogle, login } from "components/firebase/FirebaseLoginUtils";
import './index.css';
import { getUserClaims } from '../../firebase/FirebaseUtilities'
import { setLogStatus } from '../../../actions'
import { connect } from 'react-redux'


class LoginPage extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      online: false,
    };

    this.googleLogin = this.googleLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSignUpClick = this.onSignUpClick.bind(this);
  }

  async componentWillReceiveProps() {
    this.setState({
      online: true,
    })
  }

  googleLogin = async (e) => {
    e.preventDefault();

    const user = await signInWithGoogle()

    if (!user) { return }

    this.props.set(user)
    
  }

  normalLogin = async (e) => {
    e.preventDefault();

    const { email, password } = this.state

    const user = await login(e, email, password)

    if (!user) { return }

    this.props.set(user)

  }
  
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignUpClick = (e) => {
    e.preventDefault();
    this.props.history.push('/SignUp');
  }
  render() {
    if(this.state.online){
      console.log("in redirect")
      return <Redirect to = "/about"></Redirect>
    }
    return (
      <div style={{height: '100%'}}>
        <title>Login</title>
        <div className='bg-img'>
          <div className='content'>
            <header>Jewish Trail</header>
            <form onSubmit={this.normalLogin}>
              <div className='field'>
                <span  className="far fa-envelope"></span>
                <input required name="email" onChange={this.onChange} type='email' placeholder='Email...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock"></span>
                <input required name="password" onChange={this.onChange} type='password' placeholder='Pasword...'></input>
              </div>
              <div className='pass'>
                <a href='/forgotpassword'>Forgot Password?</a>
              </div>
              <div className='field space'>
                <input type='submit' value='Log In'></input>
              </div>
              <div className='login'>———————— or ————————</div>
                <div className='link'>
                <div onClick={this.googleLogin} className='google'>
                  <span>
                    <i className='fab fa-google'></i>
                  </span>
                    Login with Google
                </div>
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

const mapStateToProps = (state) => {
  return {
    status: state.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set: async (user) => { 
      await dispatch(setLogStatus({
        claims: await getUserClaims(user),
        uid: user.uid
      }))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
