import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wishlistUser.css";

const WishlistUser = () => {

  const [wishlist, setWishlist] = useState([]);
  const user = useSelector(store => store.userState.userLogin)

	const capitalize = (string) => {
		return string.substring(0, 1).toUpperCase() + string.substring(1);
  }; 
  
  const getWishlist = async (id) => {
    await axios.get(`https://api-henrycomics.herokuapp.com/wishlist/user/${id}`, {withCredentials: true})
      .then((res) => {       
        setWishlist(res.data)
      })
  }

  const delWish = async(id,userId) => {
	await axios.delete(`https://api-henrycomics.herokuapp.com/wishlist/${id}/user/${userId}`)
	getWishlist(user.id)
  }

  useEffect(() => {
    getWishlist(user.id)
  }, [])
  console.log(wishlist)
	return (
		<div>			
			<div className="tablaProd">
				<table className="table table-hover ">
					<thead>
						<tr className="table table-hover">
							<th>Id</th>
							<th>Nombre</th>
							<th>Volúmen</th>
							<th>N°</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{wishlist[0] &&
							wishlist.map((ele) => (
								<tr>
									<td>{ele.id}</td>
									<td>{capitalize(ele.name)}</td>
									<td>{ele.volume_name}</td>
									<td>{ele.volume_number}</td>
									<td className="table w-auto table-hover">
									<button className='btn btn-danger pill-rounded' onClick={()=>delWish(ele.id,ele.lista.userId)}>Quitar</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WishlistUser;
