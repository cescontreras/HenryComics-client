import React from 'react';
import './newsgrid.css';

const NewProduct = (props) => {
  const { product } = props;

  return (
    <div className="wrapper-index">
        <div className='cont-img'>
          <img src={product.image} className="img-index"/>
        </div>
        <div className="description-index">
            <h3>{product.name.substring(0, 1).toUpperCase() + product.name.substring(1)}</h3>     
            <p>{product.description}</p>
        </div>
    </div>
  );
};

export default NewProduct;