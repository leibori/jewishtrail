import React from 'react'
import './index.css'
import pic from 'assets/img/about.jpg';
import no_image_available from '../../../assets/img/no-image-available.png'


export default function About(props) {
    const name = 'About Us';
    const description1 = 'Welcome to jewish trail project. \n';
    const description2 = 'Our goal is to strengthen the bond between jewish people around the world by improving access to our shared history and heritage.'
    const description3 = 'Feel free to go on a journy and rediscover the marks that we left on the world and in the history books';
    
    return (
        <div style={{width: '100%', height: '100%',}}>

            <div style={{zIndex: '0', width: '100%', height:'40%', }}>
                <img src={pic} alt={no_image_available}/>
                <text className="bottomHeader">{name}</text>
            </div>
            <div className={"bottomcard"}>
                <p>{description1}</p>

                <p>{description2}</p>

                <p>{description3}</p>
                <p>Visit <a style={{color: '#48AAAB'}} href='http://sonshine.org.il/' >Our Website</a> for more information.</p>
            </div>
        </div>
    );
}
