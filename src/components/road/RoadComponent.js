import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Row, Col } from 'react-bootstrap'
import './index.css';
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


const RoadComponent = (props) => {
  const classes = useStyles()
  const { road, roadButtonsProps: trailButtonsProps } = props;

  var info_url = '/road/'+road.id

  const pickRoadButton = () => {
    return trailButtonsProps ? trailButtonsProps.find(buttonProps => buttonProps.canRender(road.id)) : undefined;
  }

  const buttonProps = pickRoadButton();
  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
                    { buttonProps &&
                      <Row style={{ paddingTop: '20%', paddingLeft: '45%'}}>
                        <button variant="outlined" style={{ maxHeight: '40px' }} onClick={(e) => buttonProps.buttonFunction(e, road.id)}>{buttonProps.buttonName}</button> 
                      </Row>
                    }
                  </Col>
                  <Col xs={1} style={{ paddingLeft: '0px', paddingTop: '8px' }}>
                    <Circle progress={road.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                  </Col>
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
