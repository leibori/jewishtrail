import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
// import { signInWithGoogle, login } from 'compo/firebase/FirebaseLoginUtils'
import { signInWithGoogle, login } from "components/firebase/FirebaseLoginUtils";
import { myFirebase} from "components/firebase/firebase";
import './index.css';

// const centerStyle = {
//     margin: 'auto',
//     width: '50%',
// }


export default class LoginPage extends Component {
  constructor() {
    super();
 //   this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: '',
      online: false,
      uid: '',
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSignUpClick = this.onSignUpClick.bind(this);
  }

  googleLogin = async (e) => {
    e.preventDefault();
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      online: true,
      uid: userid
    })
  }

  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({online: true})
      }else{
        this.setState({online: false})
      }  
     })
  }
  
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignUpClick = (e) => {
    e.preventDefault();
    this.props.history.push('/SignUp');
  }
  render() {
    const { email, password } = this.state;
    if(this.state.online){
      return <Redirect to = "/about"></Redirect>
    }
    return (
      <div style={{height: '100%'}}>
        <title>Login</title>
        <div className='bg-img'>
          <div className='content'>
            <header>Jewish Trail</header>
            <form onSubmit={(e)=>login(e, email, password)}>
              <div className='field'>
                <span  className="far fa-envelope"></span>
                <input required name="email" onChange={this.onChange} type='email' placeholder='Email...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock"></span>
                <input required name="password" onChange={this.onChange} type='password' placeholder='Pasword...'></input>
              </div>
              <div className='pass'>
                <a href='#'>Forgot Password?</a>
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
