import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Circle from 'react-circle';
import Button from '@material-ui/core/Button'

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
  },
}));

const buttonVote = {  
  marginTop: '10px',
  textAlign: 'center',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',
}
const SiteHandle = (props) => {
  const { site, siteButtonsProps,voteButtonsProps} = props;
  const likeStatus = voteButtonsProps ? voteButtonsProps[0].colorLike(site.uid,voteButtonsProps[0].buttonName) : null
  const [likeFlag,setLike] = useState(likeStatus)
  const dislikes = voteButtonsProps ? voteButtonsProps[1].colorDislike(site.uid,voteButtonsProps[1].buttonName) : null
  const [dislikeFlag,setDislike] = useState(dislikes)

  const info_url = '/site/'+site.uid
  const classes = useStyles()

  // const pickSiteButton = () => {
  //   return siteButtonsProps ? siteButtonsProps.find((buttonProps) => buttonProps.canRender(site.id)) : undefined;
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
              <img className={classes.img} alt="complex" src={site.imageUrl} />
            </ButtonBase>
          </Grid>

          <Grid item xs={6} sm container>

            <Grid item xs container direction="column" spacing={2}>
              
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1"><b>{site.name}</b></Typography>
                <Typography variant="body2" gutterBottom>{site.city}, {site.country}</Typography>
                <Grid item container direction='row' spacing={2}>
                  <Grid item xs={6}>
                    <button className='view-button' variant="outlined">
                      <a href={info_url}>View Site</a>
                    </button>
                  </Grid>
                  { buttonProps &&
                    (<Grid item>
                      <button variant="outlined" onClick={(e) => buttonProps.buttonFunction(site.id,site.uid,site.type)}>{buttonProps.buttonName}</button>
                    </Grid>)
                  }
                  {true &&
                  (<Grid item style ={{marginLeft:'20%'}}>
                    <Circle progress={site.vote} progressColor="#50c878" size={80} bgColor="#ff0000" lineWidth={20} textColor="#3f704d"></Circle>
                  </Grid>)
                  }
                  {like && like.canRender(site.uid) &&
                  (<Grid item style ={{marginLeft:'15%'}}>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,1,site.uid)}>{likeFlag}</button>
                  </Grid>)
                  // (<Grid item>
                  //   <button variant="outlined" style={buttonVote} onClick={(e) => tenTheBig(e,1,site.id,like.buttonName)}><span style={{color:'green'}} >{like.buttonName}</span></button>
                  // </Grid>)
                  } 
                  {dislike && dislike.canRender(site.uid) &&
                  (<Grid item>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,0,site.uid)}>{dislikeFlag}</button>
                  </Grid>)
                  }
                  {/* <Grid item xs={6}>
                    <Button onClick={()=>{if (window.confirm('Are you sure you wish to delete this item?')) deleteSite(props.id,props.uid,props.type)}} className={buttonClasses.button} variant="outlined" style={{border: 'none',background: 'none',width: '40px',height:'40px',maxHeight: '40px',maxWidth: '40px',backgroundColor: 'tranparent'}} size="small">
                    <img src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"></img>
                    </Button>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default SiteHandle