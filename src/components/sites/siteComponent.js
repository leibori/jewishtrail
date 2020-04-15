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

const SiteComponent = (props) => {
  const site = props.props.site
  const buttonName = props.props.buttonName
  const condition = props.props.condition
  const buttonFunction = props.props.buttonFunction

  const info_url = '/site/'+site.id
  const classes = useStyles()
  const buttonClasses = buttonStyles()

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
                <Typography gutterBottom variant="subtitle1"><b>Site name:</b> {site.name}</Typography>
                <Typography variant="body2" gutterBottom><b>City:</b> {site.city}.</Typography>
                <Typography variant="body2" ><b>Country:</b> {site.country}.</Typography>
                <Grid item container direction='row' spacing={2}>
                  <Grid item xs={6}>
                    <Button className={buttonClasses.button} variant="outlined" style={{color: '#b5d7c7', borderColor: '#b5d7c7', textAlign: 'center', height: '50px', marginTop: '10px'}} size="small" href={info_url}>View Site</Button>
                  </Grid>
                  {condition ?
                    (<Grid item xs={6}>
                      <Button className={buttonClasses.button} variant="outlined" style={{color: '#b5d7c7', borderColor: '#b5d7c7', textAlign: 'center', height: '50px', marginTop: '10px'}} size="small" onClick={(e) => buttonFunction(e, site.id)}>{buttonName}</Button>
                    </Grid>) : ''
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