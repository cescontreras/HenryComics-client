import React from 'react';
import { useSelector } from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import './wish.css'

export default function ProductAPI ({product}) {

  const user = useSelector(store => store.userState.userLogin);

  const addWishlist = async() => {
    if(user.id){
      let body = {
        name: product.name,
        volume_name: product.volume.name,
        volume_number: product.issue_number,
        image: product.image.small_url
      }
      await axios.post(`https://api-henrycomics.herokuapp.com/wishlist/add/${user.id}`, body, {withCredentials: true})
        .then((res) => {
          alert('Se agregó!')
        })
        .catch((err) => {
          console.log(err);          
        })
    }else {
      alert('Debe loguearse')
    }

  }

  return (
    <div className='shadow wrapper'>
        <div className="container">
            <div className="top">
                <button onClick={()=>addWishlist()} className="btn pill-rounded star-button" style={{position:'absolute',right:'0', background:'rgba(0,0,0,0.8)'}}>
                    <FontAwesomeIcon icon={faStar} color='white' id='starr'/>                            
                </button>
                <img src={product.image.small_url} className='img' alt="wish" />
            </div>
            <div className="bottom wish-bottom">
                <h4 style={{textAlign:'center'}}>{product.name}</h4>
                <div className="left">
                    <span>Vol. {product.volume.name} #{product.issue_number}</span>
                </div>
            </div>
        </div>
    </div>
  );
};