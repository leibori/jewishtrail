import React, { Component } from 'react'
import {getUserClaims} from '../firebase/FirebaseUtilities'
import {myFirebase} from '../firebase/firebase'
// import { MyFancyComponent } from '../GoogleMaps'
// import { SimpleMap } from '../GoogleMaps'
// import {Map} from '../OpenLayers'
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

var myIcon = L.icon({
    iconUrl: 'http://images.clipartpanda.com/blue-location-icon-Location_marker_pin_map_gps.png',
    iconSize: [41, 41],
    iconAnchor: [21.5, 41],
    popupAnchor: [0, -41]
});

class Menu extends Component {

    state = {
        lat: 51.505,
        lng: -0.09,
        zoom: 13,
    }

    async componentDidMount(){
        //console.log(await getUserClaims())
        //this.setState({claim: await getUserClaims()});
        myFirebase.auth().onAuthStateChanged(async (user) => {
            this.setState({claim: await getUserClaims(user)});
        })
    }

    render() {
        const position = [this.state.lat, this.state.lng]
        return(
                <div>
                    <p>Welcome to the "Jewish Trail" project.</p>
                    <p>Our goal is to strenghen the bond between the jewish people around the world by improving access to our shared history and heritage.</p>
                    <p>Feel free to go on a journey and rediscover the marks the we left on the world and in the history books.</p>
                    <Map style={{height: '600px', width: '60%', position: "absolute", left: '50%', top: '50%', transform: 'translate(-50%, -10%)'}}
                        center={position} zoom={this.state.zoom}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} icon={myIcon}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                        </Marker>
                    </Map>
                </div>
        )
    }
}

export default Menu