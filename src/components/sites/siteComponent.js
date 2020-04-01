import React from 'react'
import { Link } from 'react-router-dom'

const SiteComponent = ({props}) => {
  var info_url = '/site/'+props.id
  return (
    <div className="card z-depth-0 project-summary">
    <div className="card-content grey-text text-darken-3">
      <div className="site-name ">Name: {props.name}</div>
      <div className="site-city ">City: {props.city}</div>
      <div className="site-country ">Country: {props.country}</div>
      {
        <div className="container">
            {props.tags.map((tag, i) => {
               return (<span key = {i}> {tag} </span>) 
            })}
        </div>  
      }
      <Link to={info_url}>More info</Link>
    </div>
  </div>
  )
}

export default SiteComponent