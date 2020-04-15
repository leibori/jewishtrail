import React, { Component } from "react";
import { getSiteByID } from '../firebase/FirebaseUtilities'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { myIcon } from '../map/MapUtilities'
import { Card } from 'react-bootstrap'

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
        this.setState({ ...all_site_props})
    }

    render() {
        const position = [this.state.latitude, this.state.longitude]
        const zoom = 17
        const imageUrl = this.state.imageUrl
        return (
            <div>
                <Card style={{ width: '100%', height: '100%' }}>
                    <Card.Img variant="top" src={imageUrl} />
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Title>{this.state.address}</Card.Title>
                        <Card.Text>
                        {this.state.fullInfo}
                        </Card.Text>
                    </Card.Body>
                    <Card.Body>
                        <Card.Link href={this.state.externalSourceUrl}>Source</Card.Link>
                    </Card.Body>
                    </Card>
                {/* <h1>{this.state.name}</h1>
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
                </div> */}
            </div>
        )
    }
}

export default SitePage