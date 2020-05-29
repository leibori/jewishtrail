import React from "react";
import {Card} from 'react-bootstrap'
import { Link } from "react-router-dom";

const buttonstyle = {
    backgroundColor: '#e3242b',
    color: 'white',
    fontweight: '600',
    border: '2px solid #e3242b',
    borderRadius: '5px',
    marginTop: '0%'
}

const TextCard = (props) => {
    const { massege, buttonsProps } = props;
    const myButtonFunction = buttonsProps ? buttonsProps : undefined
    const info_url = '/massege/' + massege.id
    // get summery of user massege.
    const cardDetials = massege.details.length > 30 ? massege.details.substring(0,30) + '...' : massege.details; 
    return(  
    <Card style={{ width: '100%'}}>
    <Card.Body>
        <Card.Title>{massege.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">From: {massege.name}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Email: {massege.email}</Card.Subtitle>
        <Card.Text> {cardDetials} </Card.Text>
        <Link style={{color:"#1295b1", paddingRight:'4%'}} to={{pathname:'/massege/' + massege.id, state:{data:massege}}}>More Info</Link>

        {myButtonFunction &&
            (<Card.Link>
                <button onClick={(e) => myButtonFunction.buttonFunction(e, massege.id)} style={buttonstyle}>{myButtonFunction.buttonName}</button>
            </Card.Link>)
        }

    </Card.Body>
    </Card>)
}

export default TextCard