import React,{useState} from 'react';
import {  makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
  }));

const SelectStyle = (props) =>{
  const {passFunction,type} = props
  let optionValues = type == 'search' ? ["Field","Name","Country","City"] : ["Sort by","Distances","Rates"]
  const classes = useStyles();
  const [state, setState] = useState({
    age: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    passFunction(event.target.value)
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple" style={{fontSize:'16px',color:'#ECECEC',textShadow: "2px 2px black",fontWeight:'800',fontFamily: "Cambay, sans-serif",}}>{optionValues[0]}</InputLabel>
        <Select
          native
          value={state.age}
          onChange={handleChange}
          inputProps={{
            name: 'age',
            id: 'age-native-simple',
          }}
        >
          <option aria-label="None" value=""/>
          <option style={{fontSize:'16px',color:'Black'}} value={optionValues[1]}>{optionValues[1]}</option>
          <option style={{fontSize:'16px',color:'Black'}} value={optionValues[2]}>{optionValues[2]}</option>
          {optionValues.length > 3 &&
          (<option style={{fontSize:'16px',color:'Black'}} value={optionValues[3]}>{optionValues[3]}</option>)}
        </Select>
      </FormControl>
  );
}

export default SelectStyle