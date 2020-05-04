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
            var markers = await findSitesByCountryForMarker(nextProps.position.country)
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
                <div style={{height: '100%'}}>
                    <Card style={{ width: '100%', height: '100%' }}>
                        <Card.Body style={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px', height: '34%', backgroundImage: "url(https://media.istockphoto.com/photos/the-perfect-vantage-point-picture-id546763388?k=6&m=546763388&s=170667a&w=0&h=Lqd2Gaw7v39wE6uhVJAf9oXzN0Knp4RwRZlsDIvWspk=)", backgroundPosition: '0px 0px', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                            {/* <Card.Img variant="top" src='https://www.aecom.com/wp-content/uploads/2015/10/CityCenter-without-Harmon.jpg' /> */}
                            <Card.Title style={{ fontFamily: 'cambey', color: 'white', marginTop: '50%', marginLeft: '3%' }}>Discover places near you</Card.Title>
                        </Card.Body>
                        <Card.Body style={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px', paddingBottom: '0px', height: '66%'}}>
                            <div style={{ height: '100%', width: '100%'}} id='map' />
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