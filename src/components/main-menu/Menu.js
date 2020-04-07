import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { findSitesByCountryForMarker } from '../search/SearchUtils'
import { myIcon, getCoordinatesByAddress } from '../map/MapUtilities'

class Menu extends Component {

    state = {
        location: {
            lat: 41.294856,
            lng: -4.055685,
        },
        zoom: 5,
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
        console.log(markers)
        this.setState({ markers: markers })
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng]
        return(
                <div>
                    <p>Welcome to the "Jewish Trail" project.</p>
                    <p>Our goal is to strenghen the bond between the jewish people around the world by improving access to our shared history and heritage.</p>
                    <p>Feel free to go on a journey and rediscover the marks the we left on the world and in the history books.</p>
                    <Map style={{height: '400px', width: '60%', position: "absolute", left: '50%', top: '50%', transform: 'translate(-50%, -10%)'}}
                        center={position} zoom={this.state.zoom} >
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        { 
                            this.state.haveUsersLocation ? 
                            <Marker position={position} icon={myIcon}>
                                <Popup>
                                    You are here.
                                </Popup>
                            </Marker> : ''
                        }
                        {
                            this.state.markers.map((site, i) => (
                                <Marker key={i} position={[site.latitude, site.longitude]} icon={myIcon}>
                                    <Popup>
                                        {site.name}<br/>
                                        {site.address}<br/>
                                        {site.partialInfo}<br/>
                                        <Link to={'/site/'+site.id}>More info</Link>
                                    </Popup>
                                </Marker>
                            )
                        )}
                    </Map>
                    {/* <script style={{height: '600px', width: '60%'}} type='text/javascript' src='test.js'></script> */}
                </div>
        )
    }
}

export default Menu