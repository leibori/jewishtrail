import React, { Component } from "react";
import { getSiteByID } from '../firebase/FirebaseUtilities'

class SitePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            site_id: props.match.params.id
        }
    };

    async componentWillMount() {
        var all_site_props = await getSiteByID(this.state.site_id)
        console.log(all_site_props)
        this.setState({name: all_site_props.name, city: all_site_props.city, country: all_site_props.country})
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.city}</h2>
                <h3>{this.state.country}</h3>
                <p>info</p>
            </div>
        )
    }
}

export default SitePage