import React from 'react'
import { Link } from 'react-router-dom'

const RoadComponent = ({props}) => {
  var info_url = '/road/'+props.id
  return (
    <div className="card z-depth-0 project-summary">
    <div className="card-content grey-text text-darken-3">
      <div className="site-name ">Road name: {props.name}</div>
      <div className="site-city ">Cities: {props.city.join(", ")}.</div>
      <div className="site-country ">Countries: {props.country.join(", ")}.</div>
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

export default RoadComponent