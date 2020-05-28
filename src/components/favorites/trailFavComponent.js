import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Row, Col } from 'react-bootstrap'
import '../trail/index.css';
import Circle from 'react-circle';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '100%',
    ['@media screen and (min-width:768px)']: {
      padding: theme.spacing(1),
      width:'100%',
      height:'180px'
    },
  },
  image: {
    width: '100%',
    height: '150px',
    ['@media screen and (min-width:600px)']: {
      height: '150px',
      width:'100%'
    },
  },
  img: {
    outline: 'none',
    margin: 'auto',
    display: 'block',
  },
}));

const TrailFavComponent = (props) => {
  const classes = useStyles()
  const { Trail, siteButtonsProps } = props;
  var info_url = '/trail/'+Trail.uid
  

  const buttonProps = siteButtonsProps[0]

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <Link to={info_url} className="black-text"> */}
        <Grid container spacing={2} direction='row'>
          
          <Grid item xs={6} lg>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={Trail.imageUrl} />
            </ButtonBase>
          </Grid>

          <Grid item xs={6} sm container>

            <Grid item xs container direction="column" spacing={2}>
              
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1"><b>{Trail.name}</b></Typography>
                <Typography variant="body2" gutterBottom><b>Cities:</b> {Trail.city.join(", ")}.</Typography>
                <Typography variant="body2" ><b>Countries:</b> {Trail.country.join(", ")}.</Typography>
                <Grid item container direction='row' spacing={2}>
                <Col xs={7}>
                    <Row style={{ paddingLeft: '10%' }}>
                    <button className="view-button" variant="outlined">
                      <a href={info_url}>View Trail</a>
                    </button>
                    </Row>
                    <Row style={{ paddingTop: '20%', paddingLeft: '45%'}}>
                      <button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => buttonProps.buttonFunction(Trail.id,Trail.uid,Trail.type)}>{buttonProps.buttonName}</button>
                    </Row>
                    </Col>
                    <Col xs={1} style={{ paddingLeft: '0px', paddingTop: '8px' }}>
                    <Circle progress={Trail.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={20} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
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

export default TrailFavComponent