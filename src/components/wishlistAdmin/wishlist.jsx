import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wishlist.css";

const Wishlist = () => {

  const [wishlist, setWishlist] = useState([]);

	const capitalize = (string) => {
		return string.substring(0, 1).toUpperCase() + string.substring(1);
  };
  
  const getWishlist = async () => {
    await axios.get('https://api-henrycomics.herokuapp.com/wishlist', {withCredentials: true})
      .then((res) => {
        let wishes = res.data;
        wishes.sort(function (a, b) {
          if (a.users.length > b.users.length) {
            return 1;
          }
          if (a.users.length > b.users.length) {
            return -1;
          }
          return 0;
        });
        setWishlist(wishes)
      })
  }

  useEffect(() => {
    getWishlist()
  }, [])

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
							<th>Cantidad</th>
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
									<td>{ele.users.length}</td>
									<td className="table w-auto table-hover">
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Wishlist;
