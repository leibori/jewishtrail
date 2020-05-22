import React from "react";
import {Card} from 'react-bootstrap'

const buttonstyle = {
    backgroundColor: '#e3242b',
    color: 'white',
    fontweight: '600',
    border: '2px solid #e3242b',
    borderRadius: '5px',
}

const TextCard = (props) => {
    // const { massege} = props;
    const massege_url = '/massegeList'
    let formerState;
    if (props.location && props.location.state){
        formerState =  props.location.state   
    }
    const {details,email,id,name,title} = formerState.data
    // get summery of user massege.
    return(
    <div style={{ width:'100%', height:'100%',background:"#d9dddc"}}>
        <div style={{paddingTop:'18%',paddingLeft:'5%'}}>
            <h1 style={{paddingTop:'5%',fontWeight:'500', maxWidth:'90%',paddingLeft:'3%'}}>Title: {title}</h1>
            <h3 style={{paddingTop:'5%',fontWeight:'300', maxWidth:'90%',paddingLeft:'3%'}}>Name: {name}</h3>
            <h3 style={{paddingTop:'5%',fontWeight:'300', maxWidth:'90%',paddingLeft:'3%'}}>Email: {email}</h3>
            <h3 style={{paddingTop:'5%',fontWeight:'600', maxWidth:'90%',paddingLeft:'28%',textDecoration:'underline'}}>Massege</h3>
            <br></br>
            <div style={{boxSizing:'content-box',width:'80%',height:'200px',padding:'10px',border:'3px solid black',borderRadius:'10px',fontSize:'20px'}}>{details}</div>
            <br></br>
            <a style={{marginTop:'30px',fontSize:'40px',color:"black"}} href={massege_url} className="fas fa-arrow-left" ></a>
        </div>
    </div>  
    )
}

export default TextCard