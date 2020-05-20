import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Row, Col } from 'react-bootstrap'
import Circle from 'react-circle';

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


// const buttonVote = {  
//   marginTop: '10px',
//   textAlign: 'center',
//   borderRadius: '4px',
//   background: 'transparent',
//   border: 'none',
// }


const SiteComponent = (props) => {
  // const { site, siteButtonsProps,voteButtonsProps} = props;
  const { site, siteButtonsProps } = props;

  // console.log(voteButtonsProps)

  // const likeStatus = voteButtonsProps ? voteButtonsProps[0].colorLike(site.id,voteButtonsProps[0].buttonName) : null
  // const [likeFlag,setLike] = useState(likeStatus)
  // const dislikes = voteButtonsProps ? voteButtonsProps[1].colorDislike(site.id,voteButtonsProps[1].buttonName) : null
  // const [dislikeFlag,setDislike] = useState(dislikes)

  // console.log(dislikeFlag)
  // const buttonName = props.props.buttonName
  // const condition = props.props.condition
  // const buttonFunction = props.props.buttonFunction

  const info_url = '/site/'+site.id
  const classes = useStyles()
  // const buttonClasses = buttonStyles()
  
  const pickSiteButton = () => {
    return siteButtonsProps ? siteButtonsProps.find((buttonProps) => buttonProps.canRender(site.id)) : undefined;
  }
  // const setVoteDb = (e,vote,siteId)=>{
  //   const likeButton = like.buttonName
  //   const dislikeButton = dislike.buttonName
  //   vote ? like.buttonFunction(e,vote,siteId) :dislike.buttonFunction(e,vote,siteId)
  //   setDislike(dislike.colorDislike(siteId,dislikeButton))
  //   setLike(like.colorLike(siteId,likeButton))
  // }
  // const pickIconButton = () =>{
  //   return voteButtonsProps ? voteButtonsProps.find((voteProps) => voteProps.canRender(site.id)) : undefined;
  // }

  const buttonProps = pickSiteButton();
  // const like = voteButtonsProps ? voteButtonsProps[0] : undefined
  // const dislike = voteButtonsProps ? voteButtonsProps[1] : undefined
  
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
                <Col xs={7}>
                    <Row style={{ paddingLeft: '10%' }}>
                      <button className='view-button' variant="outlined">
                        <a href={info_url}>View Site</a>
                      </button>
                    </Row>
                    <Row style={{ paddingTop: '20%', paddingLeft: '45%'}}>
                      { buttonProps &&
                        <button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => buttonProps.buttonFunction(e, site.id)}>{buttonProps.buttonName}</button>
                      }
                    </Row>
                  </Col>
                  <Col xs={1} style={{ paddingLeft: '0px', paddingTop: '8px' }}>
                    <Circle progress={site.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                  </Col>

                  {/* <Grid item xs={6}>
                    <button className='view-button' variant="outlined">
                      <a href={info_url}>View Site</a>
                    </button>
                  </Grid>
                  { buttonProps &&
                    (<Grid item>
                      <button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => buttonProps.buttonFunction(e, site.id)}>{buttonProps.buttonName}</button>
                    </Grid>)
                  }
                  {true &&
                  (<Grid item style ={{marginLeft:'20%'}}>
                    <Circle progress={site.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                  </Grid>)
                  } */}

                  {/* {like && like.canRender(site.id) &&
                  (<Grid item style ={{marginLeft:'15%'}}>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,1,site.id)}>{likeFlag}</button>
                  </Grid>)
                  } 
                  {dislike && dislike.canRender(site.id) &&
                  (<Grid item>
                    <button variant="outlined" style={buttonVote} onClick={(e) => setVoteDb(e,0,site.id)}>{dislikeFlag}</button>
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

export default SiteComponent