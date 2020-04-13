import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import  {myFirebase} from '../firebase/firebase';
import {signup} from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

const centerStyle = {
  margin: 'auto',
  width: '50%',
}

class SignUp extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      online: '',
      email: '',
      password: '',
      username:'',
    };
    this.onSignup = this.onSignup.bind(this);
    this.handleChange = this.handleChange.bind();
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
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignup = (e) => {
    const { email, password, username } = this.state;
    e.preventDefault();
    signup(e, email, password, username);
    this.props.history.push('/Menu');
  }
  render() {
    if(this.state.online){
      return <Redirect to = "/Menu"></Redirect>
    }
    const { email, password, username } = this.state;
    return (
        <MDBContainer>
            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                <MDBCol md="4">
                    <MDBCard>
                        <div className="header pt-3 blue-gradient">
                            <MDBRow className="d-flex justify-content-center">
                                <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                Sign Up
                                </h3>
                            </MDBRow>
                            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                                <a onClick={this.googleLogin} className="fa-lg p-2 m-2 gplus-ic">
                                    <MDBIcon fab className="fa-google-plus-g white-text fa-lg" />
                                </a>
                            </MDBRow>
                        </div>
                        <MDBCardBody className="mx-4">
                          <form onSubmit={this.onSignup}>
                            <div class="md-form mt-3">
                              <input required name="email" onChange={this.handleChange} type="email" id="materialSubscriptionFormPasswords" class="form-control"/>
                              <label for="materialSubscriptionFormPasswords"> Email...</label>
                            </div>
                            <div class="md-form mt-3">
                              <input required type="password" name="password" onChange={this.handleChange} id="materialSubscriptionFormPasswords" class="form-control"/>
                              <label for="materialSubscriptionFormPasswords">Password...</label>
                            </div> 
                            <div class="md-form mt-3">
                              <input required type="text" name="username" onChange={this.handleChange} id="materialSubscriptionFormPasswords" class="form-control"/>
                              <label for="materialSubscriptionFormPasswords">Username...</label>
                            </div>  
                            <div style={{margin: 'auto'}} className="text-center mb-3">
                                <MDBBtn
                                    type="submit"
                                    gradient="blue"
                                    rounded
                                    className="z-depth-1a"
                                    style={{borderRadius: '18px',}}                                    
                                >
                                  Sign up
                                </MDBBtn>
                            </div>
                          </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );}
}
export default SignUp;