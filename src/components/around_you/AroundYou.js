import React, { Component } from 'react'
import { findSitesByCountryForMarker } from '../search/SearchUtils'
import { getAroundYouMap, findUserPosition } from '../map/MapUtilities'
import { connect } from 'react-redux'
import backgroundImage from '../../assets/img/AroundYouBG.jpg'


/**
 * This component is holds the all of th elements of a "Around you" page.
 * It calls a function that finds the user's country and location by coordinates.
 * It also calls function that creates markers for all of the sites that are located in the same country as the user and places them on the page's map.
 */
class AroundYou extends Component {

    state = {
        
        zoom: 10,
        markers: []
    }

    
    /**
     * This function is called after the user's location is saved in the local storage.
     * After that it handles the functionalities that where mentioned above.
     * @param {props} nextProps 
     */
    async componentWillReceiveProps(nextProps) {

        if (this.props.position !== nextProps.position) {
            var markers = await findSitesByCountryForMarker(nextProps.position.country)
            this.setState({ markers: markers })

            getAroundYouMap('map', nextProps.position.lat, nextProps.position.lng, this.state.zoom, markers)
        }
    }


    /**
     * This function is called when the page is loaded and it handles the functionalities that where mentioned above.
     */
    async componentWillMount() {

        if (this.props.position.country === '') {
            await this.props.find()
        } else {
            var markers = await findSitesByCountryForMarker(this.props.position.country)
            this.setState({ markers: markers })
            getAroundYouMap('map', this.props.position.lat, this.props.position.lng, this.state.zoom, markers)
        }
    }


    render() {
        return(
                <div style={{height: '100%'}}>

                    {/* This div contains the top part with the image and the title of the page. */}
                    <div style={{  marginLeft: '0px', marginRight: '0px', marginTop: '0px', height: '34%', }}>
                        <img src={backgroundImage}/>
                        <header style={{ position: 'absolute', top:'25%', zIndex: '1', fontWeight: '800', fontSize: '23px', textShadow: '1px 1px black', fontFamily: 'cambay', color: 'white', marginLeft: '3%' }}>Discover places near you</header>

                    </div>

                    {/* This div contains the rest of the page which is the map. */}
                    <div style={{  position: 'fixed', top: '34%', paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px', paddingBottom: '0px', height: '66%'}}>
                        <div style={{ position: 'fixed', height: '100%', width: '100%'}} id='map' />
                    </div>

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
        find: async () => findUserPosition(dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AroundYou);