import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Row, Col } from 'react-bootstrap'
import './index.css';
import Circle from 'react-circle';

// const buttonVote = {  
//   marginTop: '10px',
//   textAlign: 'center',
//   borderRadius: '4px',
//   background: 'transparent',
//   border: 'none',
// }

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '100%',
  },
  image: {
    width: '100%',
    height: '150px',
  },
  img: {
    outline: 'none',
    margin: 'auto',
    display: 'block',
  },
}));

const RoadComponent = (props) => {
  const classes = useStyles()
  // const { road, roadButtonsProps ,voteButtonsProps} = props;
  const { road, roadButtonsProps } = props;

  // const likeStatus = voteButtonsProps ? voteButtonsProps[0].colorLike(road.id,voteButtonsProps[0].buttonName) : null
  // const [likeFlag,setLike] = useState(likeStatus)
  // const dislikes = voteButtonsProps ? voteButtonsProps[1].colorDislike(road.id,voteButtonsProps[1].buttonName) : null
  // const [dislikeFlag,setDislike] = useState(dislikes)

  var info_url = '/road/'+road.id

  const pickRoadButton = () => {
    return roadButtonsProps.find(buttonProps => buttonProps.canRender(road.id));
  }

  // const setVoteDb = (e,vote,siteId)=>{
  //   const likeButton = like.buttonName
  //   const dislikeButton = dislike.buttonName
  //   vote ? like.buttonFunction(e,vote,siteId) :dislike.buttonFunction(e,vote,siteId)
  //   setDislike(dislike.colorDislike(siteId,dislikeButton))
  //   setLike(like.colorLike(siteId,likeButton))
  // }

  const buttonProps = pickRoadButton();
  // const like = voteButtonsProps ? voteButtonsProps[0] : undefined
  // const dislike = voteButtonsProps ? voteButtonsProps[1] : undefined

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <Link to={info_url} className="black-text"> */}
        <Grid container spacing={2} direction='row'>
          
          <Grid item xs={6} lg>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={road.imageUrl} />
            </ButtonBase>
          </Grid>

          <Grid item xs={6} sm container>

            <Grid item xs container direction="column" spacing={2}>
              
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1"><b>{road.name}</b></Typography>
                <Typography variant="body2" gutterBottom><b>Cities:</b> {road.city.join(", ")}.</Typography>
                <Typography variant="body2" >{road.country[0]}</Typography>
                <Grid item container direction='row' spacing={2}>
                  <Col xs={7}>
                    <Row style={{ paddingLeft: '10%' }}>
                      <button className="view-button" variant="outlined">
                        <a href={info_url}>View Trail</a>
                      </button>
                    </Row>
                    <Row style={{ paddingTop: '20%', paddingLeft: '45%'}}>
                      <button  variant="outlined" onClick={(e) => buttonProps.buttonFunction(e, road.id)}>{buttonProps.buttonName}</button>
                    </Row>
                  </Col>
                  <Col xs={1} style={{ paddingLeft: '0px', paddingTop: '8px' }}>
                    <Circle progress={road.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                  </Col>

                  {/* <Grid item xs={6}>
                    <button className="view-button" variant="outlined">
                      <a href={info_url}>View Trail</a>
                    </button>
                  </Grid>
                  {true &&
                  (<Grid item style ={{marginLeft:'20%'}}>
                    <Circle progress={road.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                  </Grid>)
                  }
                  { buttonProps &&
                    <Grid item>
                      <button  variant="outlined" onClick={(e) => buttonProps.buttonFunction(e, road.id)}>{buttonProps.buttonName}</button>
                    </Grid>
                  } */}
                  {/* {like && like.canRender(road.id) &&
                  (<Grid item style ={{marginLeft:'15%'}}>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,1,road.id)}>{likeFlag}</button>
                  </Grid>)
                  } 
                  {dislike && dislike.canRender(road.id) &&
                  (<Grid item>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,0,road.id)}>{dislikeFlag}</button>
                  </Grid>)
                  } */}
                </Grid>
              </Grid>

            </Grid>

          </Grid>
        </Grid>
      </Paper>
    </div>

  )
}

export default RoadComponent
