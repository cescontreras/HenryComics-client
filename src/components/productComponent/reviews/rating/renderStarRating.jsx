import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

export default function RenderStarRating({puntaje, size}) {  
 
  return (
    <div>
      <Box align="left" mb={1} borderColor="transparent">
        <Rating
          size={size}
          value={puntaje}          
          name="rating"
          readOnly="true"
        />
      </Box>
    </div>
  )
}
