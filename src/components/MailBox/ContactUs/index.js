import React, { Component } from 'react';
import './index.css';
import {createContactMassege} from 'components/firebase/FirebaseUtilities'
import TextCard from 'components/MailBox/TextCard'

class ContactUs extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      title: '',
      details: "",
    };

    this.createMessage = this.createMessage.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentWillReceiveProps() {
    this.setState({
      online: true,
    })
  }

  createMessage = async (e) =>{
    e.preventDefault()
    const {name, email, title, details} = this.state
    await createContactMassege(name, email, title, details)
    this.props.history.push('/About');
  }
  
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <title>Contact Us</title>
        <div className='bg-img'>
          <div className='content'>
            <header>Contact Us</header>
            <form style={{marginTop: '0px'}} onSubmit={(e) => this.createMessage(e)}>
            <div className='field'>
                <span  className="fas fa-user"></span>
                <input required name="name" onChange={this.onChange} type='text' placeholder='from'></input>
              </div>
              <div className='field space'>
                <span  className="far fa-envelope"></span>
                <input required name="email" onChange={this.onChange} type='email' placeholder='Email'></input>
              </div>  
              <div className='field space'>
                <span className="fas fa-heading"></span>
                <input required name="title" onChange={this.onChange} type='text' placeholder='Title'></input>
              </div>
              <div>
                <textarea className='field space' required name="details" style={{height:'120px'}} onChange={this.onChange} placeholder='Message...' type='text'></textarea>
              </div>
              <div className='field text-space' style={{marginTop:'30px'}}>
                <input type='submit' value='Submit'></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


export default ContactUs;