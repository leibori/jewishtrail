import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Circle from 'react-circle';


const dotStyle = {
  padding:10,
      margin:20,
      display:"inlineBlock",
      backgroundColor: '#1C89BF',
      borderRadius: "50%",
      width:25,
      height:25,
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
  },
}));


const buttonVote = {  
  marginTop: '10px',
  textAlign: 'center',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',

}
const SiteComponent = (props) => {
  const { site, siteButtonsProps,voteButtonsProps} = props;
  console.log(voteButtonsProps)
  const [likeFlag,setLike] = useState(voteButtonsProps[0].colorLike(site.id,voteButtonsProps[0].buttonName))
  const [dislikeFlag,setDislike] = useState(voteButtonsProps[1].colorDislike(site.id,voteButtonsProps[1].buttonName))
  console.log(dislikeFlag)
  // const buttonName = props.props.buttonName
  // const condition = props.props.condition
  // const buttonFunction = props.props.buttonFunction

  const info_url = '/site/'+site.id
  const classes = useStyles()
  // const buttonClasses = buttonStyles()
  
  const pickSiteButton = () => {
    return siteButtonsProps ? siteButtonsProps.find((buttonProps) => buttonProps.canRender(site.id)) : undefined;
  }
  const tenTheBig = (e,vote,siteId)=>{
    const likeButton = like.buttonName
    const dislikeButton = dislike.buttonName
    vote ? like.buttonFunction(e,vote,siteId) :dislike.buttonFunction(e,vote,siteId)
    setDislike(dislike.colorDislike(siteId,dislikeButton))
    setLike(like.colorLike(siteId,likeButton))
  }
  // const pickIconButton = () =>{
  //   return voteButtonsProps ? voteButtonsProps.find((voteProps) => voteProps.canRender(site.id)) : undefined;
  // }

  const buttonProps = pickSiteButton();
  const like = voteButtonsProps[0] ? voteButtonsProps[0] : undefined
  const dislike = voteButtonsProps[1] ? voteButtonsProps[1] : undefined
  
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
                <Grid item container direction='row' spacing={1}>
                  <Grid item xs={6}>
                    <button className='view-button' variant="outlined">
                      <a href={info_url}>View Site</a>
                    </button>
                  </Grid>
                  { buttonProps &&
                    (<Grid item>
                      <button variant="outlined" onClick={(e) => buttonProps.buttonFunction(e, site.id)}>{buttonProps.buttonName}</button>
                    </Grid>)
                  }
                  {true &&
                  (<Grid item style ={{marginLeft:'20%'}}>
                    <Circle progress={35} progressColor="#50c878" size={80} bgColor="#ff0000" lineWidth={20} textColor="#3f704d"></Circle>
                  </Grid>)
                  }
                  {like && like.canRender(site.id) &&
                  (<Grid item style ={{marginLeft:'15%'}}>
                    <button variant="outlined" style={buttonVote} onClick={(e) => tenTheBig(e,1,site.id)}>{likeFlag}</button>
                  </Grid>)
                  // (<Grid item>
                  //   <button variant="outlined" style={buttonVote} onClick={(e) => tenTheBig(e,1,site.id,like.buttonName)}><span style={{color:'green'}} >{like.buttonName}</span></button>
                  // </Grid>)
                  } 
                  {dislike && dislike.canRender(site.id) &&
                  (<Grid item>
                    <button variant="outlined" style={buttonVote} onClick={(e) => tenTheBig(e,0,site.id)}>{dislikeFlag}</button>
                  </Grid>)
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default SiteComponent