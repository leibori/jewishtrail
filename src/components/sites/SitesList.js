import React from 'react'
import SiteComponent from './siteComponent'

const GetSitesList = ({props}) => {
    console.log(props)
    return (
      <div className="container">
        {props.map((site, i) => {
           return (<SiteComponent key={i} site={site}/>) 
        })}
      </div>
    )
}

export default GetSitesList