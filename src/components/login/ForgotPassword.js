import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { forgotPassword } from "components/firebase/FirebaseLoginUtils";

export default class ForgotPassword extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            resetMessage: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onSubmit = (e) => {
      e.preventDefault();
        const { email } = this.state;
        //forgotPassword(email).then(()=>this.props.history.push("/loginpage")).then()
        forgotPassword(email).then(()=>this.setState({
          resetMessage: "A password reset email was sent to " + email
        })).catch(function(error) {
          this.setState({ resetMessage: "invalid email"})
        });
        //alert("A password reset email was sent to " + email )
    }

    onChange = (e) => {
        this.setState( {
            [e.target.name]: e.target.value
        })
    }
    caseTimeout() {
      setTimeout(()=>{
        this.props.history.push("/loginpage")
      },1500)
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
                  {
                    this.state.resetMessage.length > 0 && (
                    <div className='container' style={{margin: '10px, 0',marginTop: '10px',padding: '1% 3%',borderRadius:'3px',background:'red',color:'color'}}><i>{this.state.resetMessage}</i>{this.caseTimeout()}</div>)
                  }
                  {
                  this.state.resetMessage.startsWith("invalid")&& (
                    <div className='container' style={{margin: '10px, 0',marginTop: '10px',padding: '1% 3%',borderRadius:'3px',background:'red',color:'color'}}><i>{this.state.resetMessage}</i></div>) 
                  }
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