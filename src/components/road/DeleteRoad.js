import React, { Component } from 'react'
import {deleteRoadFromDB} from '../firebase/FirebaseUtilities'
import RoadSearch from '../search/RoadSearch'


class DeleteRoad extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
        searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        topDownValue: 'tags',
    }
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
};

DeleteRoad = async(e, sid) => {
  const roadList = this.myRef.current.state.roadList;
  e.preventDefault();
  console.log(roadList);
  const road = roadList.find((s)=> s.id === sid );
  const index = roadList.indexOf(road);
  await deleteRoadFromDB(road)
  console.log("road" + road.name + "had deleted")
  
  roadList.splice(index,1)
  this.setState({roadList});
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}

updateTopDownhValue(e) {
  this.setState({topDownValue: e.value})
}

render() {
    return (
        <div>
            <h5 className="grey-text text-darken-3">Search Road to Delete</h5>            
            <RoadSearch ref={this.myRef}
              roadList={this.state.roadList}
              onClickMethod={this.DeleteRoad} 
              buttonName={`Delete road`}
              canRenderButton={() => true}
              searchVal={this.state.searchVal}
              returnTo='deleteRoad'/>

        </div>
    )    
  }
}

export default DeleteRoad