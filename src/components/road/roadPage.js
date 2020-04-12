import React, { Component } from "react";
import { getRoadByID } from '../search/SearchUtils'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { myIcon } from '../map/MapUtilities'
import { getSiteByID } from "../firebase/FirebaseUtilities";
import { PaginatedList } from 'react-paginated-list';
import SiteComponent from '../sites/siteComponent'
import { Link } from 'react-router-dom'

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
            markers: []
        }
    };

    async componentWillMount() {
        const roadId = this.state.site_id;
        var all_site_props = await getRoadByID(roadId)
        console.log(all_site_props)
        const siteListID = all_site_props.siteList;
        const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))
        this.setState({
                        ...all_site_props,
                        siteList

         })
    }

    render() {
        const { siteList } = this.state;
        if(!siteList.length){
            return <span>Loading...</span>
        }
        const position = [siteList[0].latitude, siteList[0].longitude]
        console.log(position)
        const zoom = 10
        console.log(this.state)
       
        const mapping = (list) => list.map((site, i) => {
            return (
                <div key={i} >
                    <li>
                        <SiteComponent props={site}/>
                    </li>
                </div>)
        });
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.city.join(", ")}.</h2>
                <h3>{this.state.country.join(", ")}</h3>
                <p>{this.state.description}</p>
                <ul className="container">
                    {siteList.length > 0 && <PaginatedList
                            list={siteList}
                            itemsPerPage={3}
                            renderList={mapping}/>}
                </ul>

                <div style={{height: '400px', width: '60%'}} >
                    <Map style={{height: '400px', width: '60%', marginLeft:"450px"}}
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
                        {
                            this.state.siteList.map((site, i) => (
                                <Marker key={i} position={[site.latitude, site.longitude]} icon={myIcon}>
                                    <Popup>
                                        {site.address}<br/>
                                        {site.partialInfo}<br/>
                                        <Link to={'/site/'+site.id}>More info</Link>
                                    </Popup>
                                </Marker>
                            )
                        )}
                    </Map>
                </div>
            </div>
        )
    }
}

export default RaodPage