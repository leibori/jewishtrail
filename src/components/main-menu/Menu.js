import React, { Component } from 'react'
import { findSitesByCountryForMarker } from '../search/SearchUtils'
import { getMenuMap } from '../map/MapUtilities'

import L, { icon } from 'leaflet';


class Menu extends Component {

    state = {
        location: {
            lat: 41.294856,
            lng: -4.055685,
        },
        zoom: 5,
        country: "",
        haveUsersLocation: false,
        markers: []
    }

    async componentWillMount(){

        // Set center of the map to be the user's current location.
        navigator.geolocation.getCurrentPosition((position) => {
            fetch('https://ipapi.co/json')
            .then(res => res.json())
            .then(location => {
                this.setState({
                    country: location.country_name
                })
            })
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude},
                    haveUsersLocation: true,
                    zoom: 13
            })
        }, () => {
            console.log('access denied')
            fetch('https://ipapi.co/json')
            .then(res => res.json())
            .then(location => {
                console.log(location)
                this.setState({
                    location: {
                        lat: location.latitude,
                        lng: location.longitude},
                    country: location.country_name,
                    haveUsersLocation: true,
                    zoom: 13})
            })
        })
         
        // var markers = await findSitesByCountryForMarker(this.state.country)
        var markers = await findSitesByCountryForMarker("Spain")
        // console.log(markers)
        this.setState({ markers: markers })

        getMenuMap('map', this.state.location.lat, this.state.location.lng, this.state.zoom, markers)
    }


    render() {
        return(
                <div>
                    <p>Welcome to the "Jewish Trail" project.</p>
                    <p>Our goal is to strenghen the bond between the jewish people around the world by improving access to our shared history and heritage.</p>
                    <p>Feel free to go on a journey and rediscover the marks the we left on the world and in the history books.</p>
                    <div style={{height: '400px', width: '60%', position: "absolute", left: '50%', top: '50%', transform: 'translate(-50%, -10%)'}} id='map' />
                </div>
        )
    }
}

export default Menu