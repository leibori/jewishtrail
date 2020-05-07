import React from 'react';
import './NotVerified.css';
//
export default function NotVerified(props) {
    const text = "Please check your email to verify your account."
    return (
        <div style={{position: 'fixed', minWidth: '100%', minHeight: '100%', margin: 'auto', display: 'flex', justifyContent: 'center',
          alignItems: 'center'}}>
            <div class="container1">
                <p class="info">{text}</p>
            </div>
        </div>
    );
}