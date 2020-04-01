import React from 'react'

const siteHandle = ({props,deleteSite}) => {
  return (
    <div className="card z-depth-0 project-summary">
    <div className="card-content grey-text text-darken-3">
      <div className="site-name ">name: {props.name}</div>
      <div className="site-city ">city: {props.city}</div>
      <div className="site-country ">Country: {props.country}</div>
      {
        <div className="container">
            {props.tags.map((tag, i) => {
               return (<span key = {i}> {tag} </span>) 
            })}
        </div>
      }
      <button onClick={()=>deleteSite(props.id,props.uid)}>Delete Site</button>  
    </div>
  </div>
  )
}

export default siteHandle