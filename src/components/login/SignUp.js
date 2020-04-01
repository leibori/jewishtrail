import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import  {myFirebase} from '../firebase/firebase';
import {signup} from '../firebase/FirebaseLoginUtils'

class SignUp extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isLoggenIn: false,
      email: '',
      password: '',
      first_name:'',
      last_name:''
    };
  }

  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({isLoggedIn: true})
      }else{
        this.setState({isLoggedIn: false})
      }
      
   })
 }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if(this.state.isLoggedIn){
      return <Redirect to = "/Menu"></Redirect>
    }
    return (
      <div className="col-md">
        <form>
          <div className="for-group">
            <label >Email address</label>
            <input  value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="for-group">
            <label >Password</label>
            <input  value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="for-group">
            <label >first_name</label>
            <input  value={this.state.first_name} onChange={this.handleChange} type="text" name="first_name" className="form-control" id="exampleFirstName" placeholder="First Name" />
          </div>
          <div className="for-group">
            <label >last_name</label>
            <input  value={this.state.last_name} onChange={this.handleChange} type="text" name="last_name" className="form-control" id="exampleLastName" placeholder="Last Name" />
          </div>
          <button onClick={(e) => signup(e, this.state.email, this.state.password, this.state.first_name, this.state.last_name)} className="btn btn-success">Signup</button>
        </form>
      </div>
    );
  }
}
export default SignUp;