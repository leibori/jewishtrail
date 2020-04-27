import React, { Component } from "react";
import { getRoadByID } from '../search/SearchUtils'
import { getAroundYouMap } from '../map/MapUtilities'
import { getSiteByID } from "../firebase/FirebaseUtilities";
import { PaginatedList } from 'react-paginated-list';
import SiteComponent from '../sites/siteComponent'
import { Card, ListGroupItem, ListGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { findPosition } from '../../actions'


class RaodPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            site_id: props.match.params.id,
            roadName: "",
            CityList: [],
            CountryList: [],
            description: "",
            siteList:[],
            haveUsersLocation: false,
            imageUrl: '',
            location: {
                lat: 41.294856,
                lng: -4.055685,
            },
            navigationLink: "https://www.google.com/maps/dir/?api=1"
        }
    };


    async handleMap() {
        const { siteList } = this.state;

        console.log(siteList)

        const maxLat = Math.max.apply(Math, siteList.map(function(site) { return site.latitude }))
        const minLat = Math.min.apply(Math, siteList.map(function(site) { return site.latitude }))

        const maxLng = Math.max.apply(Math, siteList.map(function(site) { return site.longitude }))
        const minLng = Math.min.apply(Math, siteList.map(function(site) { return site.longitude }))

        const avgLat = (maxLat + minLat) / 2
        const avgLng = (maxLng + minLng) / 2

        const zoom = Math.floor(Math.max(maxLat - minLat, maxLng - minLng))        

        getAroundYouMap('map', avgLat, avgLng, zoom, siteList)
    }

    async handleSiteList() {
        const roadId = this.state.site_id;
        var all_road_props = await getRoadByID(roadId)

        const siteListID = all_road_props.siteList;
        const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))

        this.setState({
            ...all_road_props,
            siteList
        })
    }

    async handleNavigationLink(position) {

        const { siteList } = this.state;

        console.log(siteList)

        var navLink = this.state.navigationLink + "&waypoints="
        const firstSite = siteList[0], lastSite = siteList[siteList.length - 1]
        var firstDistance = Math.sqrt(Math.pow(position.lat - firstSite.latitude, 2) + Math.pow(position.lng - firstSite.longitude, 2))
        var lastDistance = Math.sqrt(Math.pow(position.lat - lastSite.latitude, 2) + Math.pow(position.lng - lastSite.longitude, 2))

        if(firstDistance < lastDistance) {
            navLink += firstSite.latitude + "%2C" + firstSite.longitude
            for(var i = 1; i < siteList.length - 2; ++i) {
                navLink += "%7C" + siteList[i].latitude + "%2C" + siteList[i].longitude
            }
            navLink += "&destination=" + lastSite.latitude + "%2C" + lastSite.longitude
        } else {
            navLink += lastSite.latitude + "%2C" + lastSite.longitude
            for(i = siteList.length - 2; i > 0; --i) {
                navLink += "%7C" + siteList[i].latitude + "%2C" + siteList[i].longitude
            }
            navLink += "&destination=" + firstSite.latitude + "%2C" + firstSite.longitude
        }
        navLink += "&dir_action=navigate"
        // console.log(navLink)
        this.setState({
            navigationLink: navLink
        })
    }


    async componentWillReceiveProps(nextProps) {

        if (this.props.position != nextProps.position) {
            this.handleNavigationLink(nextProps.position)
        }
    }


    async componentWillMount() {

        await this.handleSiteList()

        if (this.props.position.country == '') {
            await this.props.find()
        } else {
            this.handleNavigationLink(this.props.position)
        }

        this.handleMap()
    }


    render() {
        const { siteList, navigationLink } = this.state;
        if(!siteList.length){
            return <span>Loading...</span>
        }
        const position = [siteList[0].latitude, siteList[0].longitude]
        const imageUrl = this.state.imageUrl
        // console.log(position)
        // console.log(this.state)
       
        const mapping = (list) => list.map((site, i) => {
            return (
                <div key={i} >
                    <SiteComponent site={site} siteButtonsProps={[{buttonName: null, canRender: ()=>false, buttonFunction: null}]}/>
                </div>)
        });
        return (
            <div>
                <Card style={{ width: '100%', height: '100%' }}>
                    <Card.Img variant="top" src={imageUrl} />
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Text>{this.state.description}</Card.Text>
                        <Card.Link  onClick={() => window.open(navigationLink)} style={{ color: "#1295b1" }}>Start the journey</Card.Link>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem className="container">
                            {siteList.length > 0 && <PaginatedList
                                    list={siteList}
                                    itemsPerPage={3}
                                    renderList={mapping}/>}
                        </ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <div style={{height: '400px', width: '100%'}} id='map' />
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

// export default RaodPage

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

export default connect(mapStateToProps, mapDispatchToProps)(RaodPage);