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

const buttonStyles = makeStyles({
  button: {
    textTransform: "none"
  }
})

const RoadComponent = (props) => {
  
  const { road, roadButtonsProps } = props;
  // const buttonName = props.props.buttonName
  // const condition = props.props.condition
  // const buttonFunction = props.props.buttonFunction

  var info_url = '/road/'+road.id
  const classes = useStyles()
  const buttonClasses = buttonStyles()

  const pickRoadButton = () => {
    return roadButtonsProps.find((buttonProps) => buttonProps.canRender(road.id));
  }

  const buttonInfo = pickRoadButton();

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
                    <Button className={buttonClasses.button} variant="outlined" style={{color: '#b5d7c7', borderColor: '#b5d7c7', textAlign: 'center', height: '50px', marginTop: '10px'}} size="small" href={info_url}>View Trail</Button>
                  </Grid>
                  { buttonInfo &&
                    <Grid item xs={6}>
                      <Button className={buttonClasses.button} variant="outlined" style={{color: '#b5d7c7', borderColor: '#b5d7c7', textAlign: 'center', height: '50px', marginTop: '10px'}} size="small" onClick={(e) => buttonInfo.buttonFunction(e, road.id)}>{buttonInfo.buttonName}</Button>
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
