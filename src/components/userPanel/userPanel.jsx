import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import "./userPanel.css";
import { verifyLogin } from "../../redux/users";
import WishlistUser from "../wishlistUser/wishlistUser";
import Orden from "../ordenes/orden.jsx";
import avatar from "./image/avatar.webp";

import ResetPass from "./resetPass";

const User = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.userState.userLogin);
	const [orders, setOrders] = useState();
	const [order, setOrder] = useState();
	const [status, setStatus] = useState();
	const [statusG, setStatusG] = useState();
	const [info, setInfo] = useState({
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		image: "",
		telefono: "",
	});

	const [activeTab, setActiveTab] = useState("1");
	const [activeForm, setActiveForm] = useState(false);

	const toggle = (tab) => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	const getUser = async () => {
		const { data } = await axios.get(`https://api-henrycomics.herokuapp.com/user/${user.id}`, {
			withCredentials: true,
		});

		await setInfo(data);
	};

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		getOrders(status);
	}, [status, statusG]);
	console.log("orden", order);
	const change = (order) => {
		setOrder(order);
	};

	const getOrders = async (status) => {
		let query = "";
		if (status) {
			query = `?status=${status}`;
		}
		const data = await axios.get(
			`https://api-henrycomics.herokuapp.com/orders/user/${user.id}${query}`,
			{ withCredentials: true }
		);
		let filtered = data.data.filter((p) => p.status !== "carrito");
		setOrders(filtered);
	};

	const getOrder = async (id) => {
		const data = await axios.get(`https://api-henrycomics.herokuapp.com/orders/${id}`, {
			withCredentials: true,
		});
		setOrder(data.data[0]);
	};

	const handleStatus = (e) => {
		setStatus(e.target.value);
		setOrder();
	};

	let fullname = [info.firstname, info.lastname].join(" ");

	const handleChange = (e) => {
		if (e.target.name === "firstname" || e.target.name === "lastname") {
			setInfo({
				...info,
				[e.target.name]: e.target.value
					.substring(0, 1)
					.toUpperCase()
					.concat(e.target.value.substring(1)),
			});
		} else {
			setInfo({
				...info,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleClick = async (e) => {
		if (!activeForm) {
			console.log("editar", activeForm);
			setActiveForm(true);
		} else {
			if (e.target.name === "guardar") {
				console.log("guardar", activeForm, info.telefono);
				await axios.put(`https://api-henrycomics.herokuapp.com/user/${user.id}`, info, {
					withCredentials: true,
				});
				dispatch(verifyLogin());
				getUser();
			} else {
				console.log("cancelar", activeForm, e.target.name);
				getUser();
			}
			await setActiveForm(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const uploadImage = async (e) => {
		const file = e.target.files[0];
		const base64 = await convertBase64(file);
		// console.log(base64)
		setInfo({
			...info,
			image: base64,
		});
		e.preventDefault();
	};

	const convertBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	return (
		<div className="admin">
			<Nav tabs style={{ backgroundColor: "#d23d2a" }}>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === "1" })}
						onClick={() => {
							toggle("1");
						}}
						type="button"
					>
						Perfil
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === "2" })}
						onClick={() => {
							toggle("2");
						}}
						type="button"
					>
						Actividad
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === "3" })}
						onClick={() => {
							toggle("3");
						}}
						type="button"
					>
						Cuenta
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === "4" })}
						onClick={() => {
							toggle("4");
						}}
						type="button"
					>
						Wishlist
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId="1">
					<div className="shadow profile">
						<div className="header">
							{!activeForm ? (
								info.firstname !== null ? (
									<h2>{`${fullname}`}</h2>
								) : (
									<h2>"Ingresá tu nombre"</h2>
								)
							) : (
								<Fragment>
									<div>
										<label>Nombre:</label>
										<input
											className="form-control"
											type="text"
											name="firstname"
											value={info.firstname}
											onChange={handleChange}
										/>
									</div>
									<div>
										<label>Apellido:</label>
										<input
											className="form-control"
											type="text"
											name="lastname"
											value={info.lastname}
											onChange={handleChange}
										/>
									</div>
								</Fragment>
							)}
						</div>
						<div className="body-user">
							<div className="div-img">
								{!info.image ? (
									<img className="foto" src={avatar} alt="perfil" />
								) : (
									<img className="foto" src={info.image} alt="perfil" />
								)}
								{activeForm && (
									<input
										className="form-control"
										className="file"
										type="file"
										onChange={uploadImage}
									/>
								)}
							</div>
							<form className="form-user" onSubmit={handleSubmit}>
								<div>
									<label>Username:</label>
									{!activeForm ? (
										<p>{info.username}</p>
									) : (
										<input
											className="form-control"
											type="text"
											name="username"
											value={info.username}
											onChange={handleChange}
											disabled
										/>
									)}
								</div>
								<div>
									<label>Email:</label>
									{!activeForm ? (
										<p>{info.email}</p>
									) : (
										<input
											className="form-control"
											type="text"
											name="email"
											value={info.email}
											onChange={handleChange}
										/>
									)}
								</div>
								<div>
									<label>Teléfono:</label>
									{!activeForm ? (
										<p>{info.telefono}</p>
									) : (
										<input
											className="form-control"
											type="text"
											name="telefono"
											value={info.telefono}
											onChange={handleChange}
										/>
									)}
								</div>
								<div className="button-profile">
									{!activeForm ? (
										<button
											className="btn btn-danger"
											type="submit"
											onClick={handleClick}
										>
											editar
										</button>
									) : (
										<Fragment>
											<button
												className="btn btn-dark"
												type="submit"
												name="guardar"
												onClick={handleClick}
											>
												guardar
											</button>
											<button
												className="btn btn-dark"
												type="submit"
												name="cancelar"
												onClick={handleClick}
											>
												cancelar
											</button>
										</Fragment>
									)}
								</div>
							</form>
						</div>
					</div>
				</TabPane>
				<TabPane tabId="2">
					<div>
						<div className="gral-order">
							<div className="estados-select">
								<div class="btn-group-vertical">
									<button type="button" class="btn btn-secondary" onClick={handleStatus}>
										Todas
									</button>
									<button
										type="button"
										class="btn btn-secondary"
										value="creada"
										onClick={handleStatus}
									>
										Creada
									</button>
									<button
										type="button"
										class="btn btn-secondary"
										value="procesando"
										onClick={handleStatus}
									>
										Procesando
									</button>
									<button
										type="button"
										class="btn btn-secondary"
										value="completa"
										onClick={handleStatus}
									>
										Completa
									</button>
									<button
										type="button"
										class="btn btn-secondary"
										value="cancelada"
										onClick={handleStatus}
									>
										Cancelada
									</button>
								</div>
							</div>
							<div className="lista-orden">
								<ListGroup>
									{orders &&
										orders.map((order) => (
											<ListGroupItem tag="button" onClick={() => change(order)}>
												<Badge pill>{order.status}</Badge>
												{"Orden # " + order.id}
												<span>
													{order.createdAt
														.split("T")[0]
														.replace(/-/gi, "/")
														.replace(/(\w+)\/(\w+)\/(\w+)/, "$3/$2/$1")}
												</span>
											</ListGroupItem>
										))}
								</ListGroup>
							</div>
							<div className="detalle-orden">
								{order && (
									<Orden
										order={order}
										setStatusG={setStatusG}
										statusG={statusG}
										getOrder={getOrder}
										user={user.id}
									/>
								)}
							</div>
						</div>
					</div>
				</TabPane>
				<TabPane tabId="3">{info && <ResetPass user={info} />}</TabPane>
				<TabPane tabId="4">
					<WishlistUser />
				</TabPane>
			</TabContent>
		</div>
	);
};

export default User;
