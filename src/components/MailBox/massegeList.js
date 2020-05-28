import React, { Component } from "react";
import { PaginatedList } from 'react-paginated-list';
import { Card, ListGroupItem, ListGroup} from 'react-bootstrap'
import {deleteMassegeFromDB, getMasseges} from 'components/firebase/FirebaseUtilities'
import TextCard from '../MailBox/TextCard'
//import contactUsImage from '../../assets/img/contactUs.png'

class massegeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            MassegeList: [],
            searchFlag:false,
        }
        this.DeleteSite = this.DeleteSite.bind(this)
    };

    DeleteSite = async(e, massegeID) => {
        const massegeList = this.state.MassegeList
        e.preventDefault();
        if(!(window.confirm("Are you sure you want to delete this massege?"))){
          return
        }
        const index = massegeList.findIndex(m=> m.id === massegeID );
        await deleteMassegeFromDB(massegeList[index]);
        console.log("site" + massegeList[index].name + "had deleted")
        
        massegeList.splice(index,1)
        this.setState({massegeList});
      }
      
    async componentWillMount() {
        // get all massege
        const MassegeList = await getMasseges()
        this.setState({
            MassegeList,
            searchFlag:true,
        })
        console.log(MassegeList)
   }
 
    render() {
        const {MassegeList, searchFlag,imageUrl} = this.state;
        const MassegeCounter = MassegeList.length
        const buttonName = <span className='fas fa-trash-alt'></span>

        if(!MassegeList.length && !searchFlag){
            return <span>Loading...</span>
        }

        const mapping = (list) => list.map((massege, i) => {
            return (
                <Card.Body key={i}>
                    <TextCard variant="top" massege={massege} buttonsProps={{buttonFunction: this.DeleteSite, buttonName: buttonName }}/>
                </Card.Body>)
        });
        return (
                <Card>
                    <div className="messageimage-container" style={{height: '30%'}}>
                        <Card.Img src="/image/contactUs.png" variant="top"  style={{marginTop:'10%', width: '100%'}} />
                    </div>
                    {/* <Card.Body> */}
                    <div style={{marginLeft:'10%',marginTop:'3%'}}>
                        <Card.Title>Mail Box</Card.Title>
                        <Card.Text>You Have {MassegeCounter} New Masseges</Card.Text>
                    {/* </Card.Body> */}
                    </div>
                    {MassegeList.length ? (<ListGroup className="list-group-flush">
                        <ListGroupItem className="container">
                            {MassegeList.length > 30 ? <PaginatedList 
                                    list={MassegeList}
                                    itemsPerPage={30}
                                    renderList={mapping}/>: mapping(MassegeList)}
                        </ListGroupItem>
                    </ListGroup>) : null}
                </Card>
        )
    }
}

export default massegeList;