import React, { useState } from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@material-ui/core";
import axios from "axios";
import Product from "../../productComponent/product";

const CartProduct = ({
	name,
	quantity,
	id,
	price,
	carritoDelete,
	carritoGet,
	stock,
	user,
	newPrice,
	product,
}) => {
	const [cantidad, setCantidad] = useState("");

	const carritoPut = async (body) => {
		try {
			await axios.put(`https://api-henrycomics.herokuapp.com/user/${user}/cart/`, body, {
				withCredentials: true,
			});
			carritoGet(user);
		} catch (err) {
			console.log(err);
		}
	};

	const stockProduct = () => {
		if (cantidad > stock) {
			if (user) {
				carritoPut({ id: id, quantity: stock });
			} else {
				newPrice({ id: id, price: stock * price });
			}
		} else {
			if (user) {
				carritoPut({ id: id, quantity: cantidad });
			} else {
				newPrice({ id: id, price: cantidad * price });
			}
		}
	};

	const handleInputChange = (e) => {
		setCantidad(e.target.value);
	};

	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	const capitalize = (string) => {
		let splitted = string.split(" ");
		let str = [];
		splitted.forEach((element) => {
			str.push(element.substring(0, 1).toUpperCase() + element.substring(1));
		});
		str = str.join(" ");
		return str;
	};

	return (
		<li className="item-carrito">
			<Link type="button" onClick={toggle}>
				<label>{name}</label>
			</Link>
			<div className="lab-inp-but">
				<span>${price}</span>
				<input
					className="inc-dec"
					name="quantity"
					type="number"
					min="1"
					step="1"
					max={stock}
					value={cantidad}
					placeholder={quantity}
					onChange={handleInputChange}
					onClick={() => stockProduct()}
				/>
				<span>${price * cantidad}</span>
				<Button
					className="btn btn-dark btn-sm m-2 p-1"
					onClick={() => carritoDelete(id)}
				>
					<FontAwesomeIcon icon={faCartArrowDown} />
				</Button>				
			</div>
			<Product
				modal={modal}
				toggle={toggle}
				p={product}
				capitalize={capitalize}
				cart={true}
			/>
		</li>
	);
};

export default CartProduct;
