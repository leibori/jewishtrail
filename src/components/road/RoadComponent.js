import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

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

const buttonStyles = {  
  marginTop: '10px',
  color: '#b5d7c7',
  borderColor: '#b5d7c7',
  textAlign: 'center',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',

}

const RoadComponent = (props) => {
  const classes = useStyles()
  const { road, roadButtonsProps } = props;
  // console.log(road)
  // const buttonName = props.props.buttonName
  // const condition = props.props.condition
  // const buttonFunction = props.props.buttonFunction

  var info_url = '/road/'+road.id
  
  const buttonStyles = {  
    marginTop: '10px',
    color: '#b5d7c7',
    borderColor: '#b5d7c7',
    textAlign: 'center',
    borderRadius: '4px',
    background: 'transparent',
    border: 'none',

  }

  const pickRoadButton = () => {
    return roadButtonsProps.find(buttonProps => buttonProps.canRender(road.id));
  }

  const buttonProps = pickRoadButton();

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
                <Typography gutterBottom variant="subtitle1"><b>Trail name:</b> {road.name}</Typography>
                <Typography variant="body2" gutterBottom><b>Cities:</b> {road.city.join(", ")}.</Typography>
                <Typography variant="body2" ><b>Countries:</b> {road.country.join(", ")}.</Typography>
                <Grid item container direction='row' spacing={2}>
                  <Grid item xs={6}>
                    <button variant="outlined" style={{...buttonStyles, border: '1px solid rgba(0, 0, 0, 0.23)'}}>
                      <a style={{color: 'inherit'}} href={info_url}>View Trail</a>
                    </button>
                  </Grid>
                  { buttonProps &&
                    <Grid item>
                      <button  variant="outlined" style={buttonStyles} onClick={(e) => buttonProps.buttonFunction(e, road.id)}>{buttonProps.buttonName}</button>
                    </Grid>
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

export default RoadComponent
