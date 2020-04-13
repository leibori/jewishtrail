import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {myFirebase} from '../firebase/firebase';
import { signInWithGoogle, login } from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

const centerStyle = {
    margin: 'auto',
    width: '50%',
}

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
    this.onChnage = this.onChange.bind(this);
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
    if(this.state.online){
      return <Redirect to = "/Menu"></Redirect>
    }
    const { email, password } = this.state;
    return (
        <MDBContainer>
            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                <MDBCol md="4">
                    <MDBCard>
                        <div className="header pt-3 blue-gradient">
                            <MDBRow className="d-flex justify-content-center">
                                <h1 className="white-text mb-3 pt-3 font-weight-bold">
                                Log in
                                </h1>
                            </MDBRow>
                            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                                <a onClick={this.googleLogin} className="fa-lg p-2 m-2 gplus-ic">
                                    <MDBIcon fab className="fa-google-plus-g white-text fa-lg" />
                                </a>
                            </MDBRow>
                        </div>
                        <MDBCardBody className="mx-4">
                          <form onSubmit={(e)=> login(e, email, password)}>         
                            <div class="md-form mt-3">
                              <input required name="email" onChange={this.onChange} type="email" id="materialSubscriptionFormPasswords" class="form-control"/>
                              <label for="materialSubscriptionFormPasswords"> Email...</label>
                            </div>
                            <div class="md-form mt-3">
                              <input required type="password" name="password" onChange={this.onChange} id="materialSubscriptionFormPasswords" class="form-control"/>
                              <label for="materialSubscriptionFormPasswords">Password...</label>
                            </div> 
                            <div style={{margin: 'auto'}} className="text-center mb-3">
                                <MDBBtn
                                    type="submit"
                                    gradient="blue"
                                    rounded
                                    className="z-depth-1a"
                                    style={{borderRadius: '18px',}}
                                >
                                    LOGIN
                                </MDBBtn>
                            </div>
                          </form>
                        </MDBCardBody>
                        <MDBModalFooter className="mx-auto pt-3 mb-1 justify-content-center">
                            <p align='center' className="font-small grey-text d-flex">
                            Not a member?
                            <a onClick={this.onSignUpClick} className="blue-text ml-1">
                              Sign Up
                            </a>
                             Or
                            <a onClick={(e) => this.props.history.push('/Menu')} className="blue-text ml-1">
                                Enter as a guest
                              </a>
                            </p>
                        </MDBModalFooter>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );}
}
