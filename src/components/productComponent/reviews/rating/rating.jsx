import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { useEffect } from 'react';

export default function StarRating({handleInputChange, valueInicial}) {
  
  const [value, setValue] = React.useState(valueInicial);      

  useEffect(() => {
    setValue(valueInicial)
  }, [valueInicial])

  return (
    <div>
      <Box align="left"  component="fieldset" mb={3} borderColor="transparent">
        <Rating
          value={value}
          name="puntaje"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onClick={handleInputChange}
        />
      </Box>
    </div>
  )
}