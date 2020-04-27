import React, { Component } from 'react'
import { findSitesByCountryForMarker } from '../search/SearchUtils'
import { getAroundYouMap } from '../map/MapUtilities'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import { findPosition } from '../../actions'


class AroundYou extends Component {

    state = {
        
        zoom: 10,
        markers: []
    }

    
    async componentWillReceiveProps(nextProps) {

        if (this.props.position != nextProps.position) {
            var markers = await findSitesByCountryForMarker(this.props.position.country)
            // var markers = await findSitesByCountryForMarker("Spain")
            // console.log(markers)
            this.setState({ markers: markers })

            getAroundYouMap('map', nextProps.position.lat, nextProps.position.lng, this.state.zoom, markers)
        }
    }


    async componentWillMount() {

        if (this.props.position.country == '') {
            await this.props.find()
        } else {
            var markers = await findSitesByCountryForMarker(this.props.position.country)
            // var markers = await findSitesByCountryForMarker("Spain")
            // console.log(markers)
            this.setState({ markers: markers })
            getAroundYouMap('map', this.props.position.lat, this.props.position.lng, this.state.zoom, markers)
        }
    }


    render() {
        return(
                <div>
                    <Card style={{ width: '100%', height: '100%' }}>
                        <Card.Body style={{ paddingLeft: '0px', paddingTop: '0px', paddingRight: '0px', height: '300px', backgroundImage: "url(https://www.aecom.com/wp-content/uploads/2015/10/CityCenter-without-Harmon.jpg)", backgroundPosition: '0px 0px', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                            {/* <Card.Img variant="top" src='https://www.aecom.com/wp-content/uploads/2015/10/CityCenter-without-Harmon.jpg' /> */}
                            <Card.Title style={{ fontFamily: 'cambey', color: 'white', marginTop: '50%', marginLeft: '3%' }}>Discover places near you</Card.Title>
                        </Card.Body>
                        <Card.Body style={{ height: '250px'}}>
                            <div style={{height: '100%', width: '100%', position: "absolute", left: '50%', top: '50%', transform: 'translate(-50%, -10%)'}} id='map' />
                        </Card.Body>
                    </Card>
                </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        position: state.position,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        find: async () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const location = await fetch('https://ipapi.co/json').then(res => res.json())
                dispatch(findPosition({
                    type: 'FIND_POSITION',
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    country: location.country_name
                }));
            },
            () => {
                fetch('https://ipapi.co/json')
                .then(res => res.json())
                .then(location => {
                    dispatch(findPosition({
                        type: 'FIND_POSITION',
                        lat: location.latitude,
                        lng: location.longitude,
                        country: location.country_name
                    }))
                })
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AroundYou);