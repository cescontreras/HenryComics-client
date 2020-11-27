import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
	UncontrolledCollapse,
	Button,
	CardBody,
	Card,
	Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./carrito.css";
import { getCarrito, getLocalCarrito } from "../../../redux/carrito";
import CartProduct from "./CartProduct";
import empty from "./empty_cart.png";
import Checkout from "../../checkout/Checkout.js";

export default function Carrito({ user }) {
	let history = useHistory();
	const carrito = useSelector((store) => store.carritoState.carritoProducts);
	const info = useSelector((store) => store.carritoState.carritoInfo.id);
	const dispatch = useDispatch();

	const carritoDelete = async (id) => {
		if (user.id) {
			try {
				await axios.delete(`https://api-henrycomics.herokuapp.com/user/${user.id}/cart/${id}`, {
					withCredentials: true,
				});		
				dispatch(getCarrito(user.id));
			} catch (err) {
				console.log(err);
			}
		} else {
			let data = JSON.parse(localStorage.getItem("carrito")).filter(
				(p) => p.id !== id
			);
			localStorage.setItem("carrito", JSON.stringify(data));
			agregarPrecio({ id: id }, true);
			dispatch(getLocalCarrito());
		}
	};

	const [precioCantidad, setPrecioCantidad] = useState([]);

	useEffect(() => {	
		if (user.login) {		
			dispatch(getCarrito(user.id));
		} else if (localStorage.carrito) {
			dispatch(getLocalCarrito());
		}
	}, [user]);	

	const agregarPrecio = (newPrice, del) => {
		let index = precioCantidad.findIndex((p) => p.id === newPrice.id);
		if (del) {
			return precioCantidad.splice(index, 1);
		}
		if (index !== -1) {	
			precioCantidad.splice(index, 1, newPrice);
		} else {
			setPrecioCantidad([...precioCantidad, newPrice]);
		}
		dispatch(getLocalCarrito());
	};

	const totalProduct = () => {
		let nuevo;
		let total;	
		if (carrito[0]) {
			if (user.id) {
				nuevo = carrito.map((cart) => cart.price * cart.lineaDeOrden.quantity);
			} else {
				nuevo = precioCantidad.map((cart) => cart.price);
			}
			total = nuevo.reduce((a, b) => a + b, 0);
		}
		return total ? `$${total}` : "$ 0";
	};

	const cantProduct = () => {
		let nuevo;
		let total;
		if (carrito[0]) {
			if (user.login) {
				nuevo = carrito[0] && carrito.map((cart) => cart.lineaDeOrden.quantity);
				total = nuevo.reduce((a, b) => a + b, 0);
			} else {
				total = carrito.length;
			}
		}
		if (total > 0) {
			return <Badge color="danger">{total}</Badge>;
		}
	};

	const [link, setLink] = useState("");
	const handleBuy = async () => {
		if (user.id) {
			toggle();
		} else {
			alert("Debe logearse, para seguir con su compra.");
			history.push("/signup");
		}
	};

	const handleClean = async () => {
		if (user.login) {
			await axios.delete(`https://api-henrycomics.herokuapp.com/user/${user.id}/cart`);		
			dispatch(getCarrito(user.id));
		} else if (localStorage.carrito) {
			localStorage.setItem("carrito", JSON.stringify([]));			
			setPrecioCantidad([]);
			dispatch(getLocalCarrito());
		}
	};

	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	return (
		<div className="cart">
			<Button color="dark" id="toggler" style={{ marginBottom: "1rem" }}>
				<FontAwesomeIcon icon={faShoppingCart} /> {cantProduct()}
			</Button>
			<UncontrolledCollapse toggler="#toggler">
				<Card id="card-cart">
					<CardBody>
						<h3 className="title-carrito">Carrito</h3>
						{carrito[0] ? (
							<Fragment>
								<div className="body1">
									<ul className="list-carrito">
										{carrito &&
											carrito.map((cart) => (
												<CartProduct
													name={cart.name}
													stock={cart.stock}
													quantity={user.id ? cart.lineaDeOrden.quantity : 1}
													id={cart.id}
													price={cart.price}
													carritoDelete={carritoDelete}
													carritoGet={(id) => dispatch(getCarrito(id))}
													user={user.id}
													newPrice={agregarPrecio}
													product={cart}
												/>
											))}
									</ul>
								</div>
								<div className="total">
									<label>Total: {totalProduct()}</label>
								</div>
								<div className="buttons">
									<Button
										className="btn btn-secondary btn-sm m-2 p-1"
										onClick={handleBuy}
									>
										Comprar
									</Button>
									<Button
										className="btn btn-secondary btn-sm m-2 p-1"
										onClick={handleClean}
									>
										Vaciar
									</Button>
								</div>
							</Fragment>
						) : (
							<Fragment>
								<div classN17vwame="body1">
									<img src={empty} alt="empty-cart" style={{ width: "16vw" }} />
								</div>
								<h5 style={{ padding: "5px", textAlign: "center" }}>
									Tu carrito esta vacío!
								</h5>
							</Fragment>
						)}
					</CardBody>
				</Card>
			</UncontrolledCollapse>
			<Checkout
				modal={modal}
				toggle={toggle}
				id={info}
				user={user}
				link={link}
				items={carrito}
			/>
		</div>
	);
}
