import React, { Component } from "react";
import { getSiteByID } from '../firebase/FirebaseUtilities'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { myIcon } from '../map/MapUtilities'

class SitePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            site_id: props.match.params.id,
            name: '',
            city: '',
            country: '',
            address: '',
            fullInfo: '',
            imageUrl: '',
            externalSourceUrl: '',
            latitude: 1,
            longitude: 1
        }
    };

    async componentWillMount() {
        var all_site_props = await getSiteByID(this.state.site_id)
        console.log(all_site_props)
        this.setState({ name: all_site_props.name,
                        city: all_site_props.city,
                        country: all_site_props.country,
                        address: all_site_props.address,
                        fullInfo: all_site_props.fullInfo,
                        imageUrl: all_site_props.imageUrl,
                        externalSourceUrl: all_site_props.externalSourceUrl,
                        latitude: all_site_props.latitude,
                        longitude: all_site_props.longitude})
    }

    render() {
        const position = [this.state.latitude, this.state.longitude]
        const zoom = 17
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.city}</h2>
                <h3>{this.state.country}</h3>
                <h4>{this.state.address}</h4>
                <p>{this.state.fullInfo}</p>
                <img src={this.state.imageUrl} />
                <a href={this.state.externalSourceUrl} style={{marginDown: '100px'}}>Source</a>
                <div style={{height: '400px', width: '60%'}} >
                    <Map style={{height: '400px', width: '60%'}}
                        center={position} zoom={zoom} >
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        { 
                            this.state.haveUsersLocation ? 
                            <Marker position={position} icon={myIcon}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker> : ''
                        }
                        <Marker position={position} icon={myIcon} />
                    </Map>
                </div>
            </div>
        )
    }
}

export default SitePage