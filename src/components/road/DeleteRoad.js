import React, { Component } from 'react'
import {deleteRoadFromDB} from '../firebase/FirebaseUtilities'
import RoadSearch from '../search/RoadSearch'
import {Link} from 'react-router-dom'

const buttonStyle = {
  marginLeft:"30px",
  padding:"10px 24px",
  borderRadius:'8px', 
  backgroundColor:'#5dbb63',
  opacity:'0.8',
  marginTop:'20px'
}

const LabelStyle = {
color:'white',
marginLeft:'3%',
fontWeight:'400',
fontFamily: 'Cambay, sans-serif',
textShadow:'1px 1px black'
}

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

DeleteRoad = async(e, roadID) => {
  if(!(window.confirm("Are you sure you want to Delete?"))){
    return 
  }
  e.preventDefault();
  const roadList = this.myRef.current.state.roadList;
  
  const index = roadList.findIndex(r => r.id === roadID);
  
  await deleteRoadFromDB(roadList[index])
  console.log("road" + roadList[index].name + "has been deleted")
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
        <div style={{position:"absolute",margin:'auto', width:"75%",textAlign:'center',top:'10%',height:'35%'}}>
            <h5 style={LabelStyle}>Search Road to Delete: </h5>            
            <RoadSearch ref={this.myRef}
              roadList={this.state.roadList}
              roadButtonsProps= {[{
                buttonName: `Delete road`,
                canRender: () => true,
                buttonFunction: this.DeleteRoad,
              }]}
              searchVal={this.state.searchVal}
              returnTo='deleteRoad'/>
        <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/adminRoadPage">Return</Link></button>
        </div>
    )    
  }
}

export default DeleteRoad