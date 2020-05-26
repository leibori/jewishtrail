import React, { Component } from 'react'
import {deleteTrailFromDB as deleteTrailFromDB} from '../firebase/FirebaseUtilities'
import TrailSearch from '../search/TrailSearch'
import {Link} from 'react-router-dom'
// style options
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
float:'left',
marginLeft:'20px',
fontWeight:'400',
fontFamily: 'Cambay, sans-serif',
textShadow:'1px 1px black'
}

class DeleteTrail extends Component {

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
// in case of clicking delete trail button, delete trail from data base by id.
DeleteTrail = async(e, trailID) => {
  if(!(window.confirm("Are you sure you want to Delete?"))){
    return 
  }
  e.preventDefault();
  const trailList = this.myRef.current.state.trailList;
  
  const index = trailList.findIndex(r => r.id === trailID);
  
  await deleteTrailFromDB(trailList[index])
  console.log("Trail" + trailList[index].name + "has been deleted")
  trailList.splice(index,1)
  this.setState({trailList});
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}

updateTopDownhValue(e) {
  this.setState({topDownValue: e.value})
}
// delete road page contain road seach component, call DeleteRoad function in case of clicking button.
render() {
    return (
      <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%'}}>
            <h5 style={LabelStyle}>Search trail to delete: </h5>            
            <TrailSearch ref={this.myRef}
              trailList={this.state.trailList}
              trailButtonsProps= {[{
                buttonName: `Delete trail`,
                canRender: () => true,
                buttonFunction: this.DeleteTrail,
              }]}
              searchVal={this.state.searchVal}
              returnTo='deleteTrail'/>
        <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/adminTrailPage">Return</Link></button>
        </div>
    )    
  }
}

export default DeleteTrail