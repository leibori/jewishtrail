import React, { Component } from 'react'
import { findSitesByCountryForMarker } from '../search/SearchUtils'
import { getAroundYouMap } from '../map/MapUtilities'
import { Card } from 'react-bootstrap'
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

        getAroundYouMap('map', this.state.location.lat, this.state.location.lng, this.state.zoom, markers)
    }


    render() {
        return(
                <div>
                    <Card style={{ width: '100%', height: '100%' }}>
                        <Card.Body style={{ paddingLeft: '0px', paddingTop: '0px', paddingRight: '0px', height: '300px', backgroundImage: "url(" + "https://www.aecom.com/wp-content/uploads/2015/10/CityCenter-without-Harmon.jpg" + ")", backgroundPosition: '0px 0px', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                            {/* <Card.Img variant="top" src='https://www.aecom.com/wp-content/uploads/2015/10/CityCenter-without-Harmon.jpg' /> */}
                            <Card.Title style={{ fontFamily: 'cambey', color: 'white', marginTop: '50%', marginLeft: '3%' }}>Discover places near you</Card.Title>
                        </Card.Body>
                        <Card.Body style={{ height: '350px'}}>
                            <div style={{height: '100%', width: '100%', position: "absolute", left: '50%', top: '50%', transform: 'translate(-50%, -10%)'}} id='map' />
                        </Card.Body>
                    </Card>
                </div>
        )
    }
}

export default Menu