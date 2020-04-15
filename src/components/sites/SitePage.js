import React, { Component } from "react";
import { getSiteByID } from '../firebase/FirebaseUtilities'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { myIcon, getSitePageMap } from '../map/MapUtilities'
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
            longitude: 1,
            zoom: 17
        }
    };

    async componentWillMount() {
        var all_site_props = await getSiteByID(this.state.site_id)
        console.log(all_site_props)
        this.setState({ ...all_site_props})
        getSitePageMap('map', all_site_props, this.state.zoom)
    }

    render() {
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
                    <Card.Body>
                        <div style={{height: '400px', width: '100%'}} id='map' />
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default SitePage