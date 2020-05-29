import React from 'react';
import './NotVerified.css';
import {emailAuthentication} from 'components/firebase/FirebaseLoginUtils';

export default function NotVerified(props) {
/* verify account */
    const text = "Please check your email to verify your account."
    const sub_text = "resend email"
    return (
        <div className='bg-img' style={{position: 'fixed', minWidth: '100%', minHeight: '100%', margin: 'auto', display: 'flex', justifyContent: 'center',
          alignItems: 'center'}}>
            <div className="container1">
                <header class="info">{text}<br/><a onClick={()=>emailAuthentication()} style={{textDecoration: 'underline', color: '#00CED1'}}>{sub_text}</a></header>
            </div>
        </div>
    );
}