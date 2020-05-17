import React,{useState} from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import '../road/index.css';
import Circle from 'react-circle';

const buttonVote = {  
  marginTop: '10px',
  textAlign: 'center',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',
}

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
    height: '100%',
  },
  img: {
    outline: 'none',
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const RoadHandle = (props) => {
  const classes = useStyles()
  const { road, siteButtonsProps ,voteButtonsProps} = props;

  console.log(voteButtonsProps)
  const likeStatus = voteButtonsProps ? voteButtonsProps[0].colorLike(road.uid,voteButtonsProps[0].buttonName) : null
  const [likeFlag,setLike] = useState(likeStatus)
  const dislikes = voteButtonsProps ? voteButtonsProps[1].colorDislike(road.uid,voteButtonsProps[1].buttonName) : null
  const [dislikeFlag,setDislike] = useState(dislikes)
  var info_url = '/road/'+road.uid

  // const pickRoadButton = () => {
  //   return roadButtonsProps.find(buttonProps => buttonProps.canRender(road.id));
  // }

  const setVoteDb = (e,vote,siteId)=>{
    const likeButton = like.buttonName
    const dislikeButton = dislike.buttonName
    vote ? like.buttonFunction(e,vote,siteId) :dislike.buttonFunction(e,vote,siteId)
    setDislike(dislike.colorDislike(siteId,dislikeButton))
    setLike(like.colorLike(siteId,likeButton))
  }

  const buttonProps = siteButtonsProps[0]
  const like = voteButtonsProps ? voteButtonsProps[0] : undefined
  const dislike = voteButtonsProps ? voteButtonsProps[1] : undefined
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
                <Typography variant="body2" ><b>Countries:</b> {road.country.join(", ")}.</Typography>
                <Grid item container direction='row' spacing={2}>
                <Grid item xs={6}>
                    <button className="view-button" variant="outlined">
                      <a href={info_url}>View Trail</a>
                    </button>
                  </Grid>
                  { buttonProps &&
                    <Grid item>
                      <button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => buttonProps.buttonFunction(road.id,road.uid,road.type)}>{buttonProps.buttonName}</button>
                    </Grid>
                  }
                  {true &&
                  (<Grid item style ={{marginLeft:'20%'}}>
                    <Circle progress={road.vote} progressColor="#50c878" size={80} bgColor="#ff0000" lineWidth={20} textColor="#3f704d"></Circle>
                  </Grid>)
                  }
                  {/* {like && like.canRender(road.uid) &&
                  (<Grid item style ={{marginLeft:'15%'}}>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,1,road.uid)}>{likeFlag}</button>
                  </Grid>)
                  // (<Grid item>
                  //   <button variant="outlined" style={buttonVote} onClick={(e) => tenTheBig(e,1,site.id,like.buttonName)}><span style={{color:'green'}} >{like.buttonName}</span></button>
                  // </Grid>)
                  } 
                  {dislike && dislike.canRender(road.uid) &&
                  (<Grid item>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,0,road.uid)}>{dislikeFlag}</button>
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

export default RoadHandle