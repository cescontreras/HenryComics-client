import React from "react";
import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import axios from "axios";
import "./orden.css";

const Orden = ({ order, setStatusG, statusG, getOrder, user }) => {

	const [total, setTotal] = useState(0);
	const [status, setStatus] = useState();

	useEffect(() => {
		let total = 0;

		order.products &&
			order.products.forEach((p) => {
				total = total + p.price * p.lineaDeOrden.quantity;
			});
		setTotal(total);
		setStatus(order.status);
	}, [order]);

	const handleProcess = async (order) => {
		try {
			await axios.put(
				`https://api-henrycomics.herokuapp.com/orders/${order.id}?status=procesando`,
				null,
				{ withCredentials: true }
			);
			setStatusG(!statusG);
			getOrder(order.id);
		} catch (err) {
			console.log(err);
		}
	};

	const handleComplete = async (order) => {
		try {
			await axios.put(
				`https://api-henrycomics.herokuapp.com/orders/${order.id}?status=completa`,
				null,
				{ withCredentials: true }
			);
			setStatusG(!statusG);
			getOrder(order.id);
		} catch (err) {
			console.log(err);
		}
	};

	const handleCancel = async (order) => {
		try {
			await axios.put(
				`https://api-henrycomics.herokuapp.com/orders/${order.id}?status=cancelada`,
				null,
				{ withCredentials: true }
			);
			setStatusG(!statusG);
			getOrder(order.id);
		} catch (err) {
			console.log(err);
		}
	};

	const handleRemove = async (product, orden) => {
		await axios.delete(
			`https://api-henrycomics.herokuapp.com/user/order/${orden}/product/${product}`,
			{ withCredentials: true }
		);
		setStatusG(!statusG);
		getOrder(order.id);
	};

	const [modal, setModal] = useState(false);
	const [comp, setComp] = useState(false);
	const toggle = () => setModal(!modal);
	const toggleComp = () => setComp(!comp);

	return (
		<div className="shadow orden">
			<div className="top">
				<h2>ORDEN #{order.id}</h2>
				<Table size="sm" bordered>
					<thead>
						<tr>
							<th>Nombre</th>
							<th className="tO w-20">Precio</th>
							<th className="tO w-15">Cantidad</th>
							<th className="tO w-20">Total</th>
						</tr>
					</thead>
					<tbody>
						{order &&
							order.products.map((p) => (
								<tr>
									<th scope="row">{p.name}</th>
									<td className="tO">${p.price}</td>
									<td className="tO">{p.lineaDeOrden.quantity}</td>
									<td className="tO">${p.price * p.lineaDeOrden.quantity}</td>
									{user && order.status !== "cancelada" && (
										<button
											className="btn btn-danger"
											onClick={() => handleRemove(p.id, order.id)}
										>
											X
										</button>
									)}
								</tr>
							))}
					</tbody>
				</Table>
				<div className="datos">
					<span>Estado: {order.status.toUpperCase()}</span>
					<span>
						Fecha:{" "}
						{order.createdAt
							.split("T")[0]
							.replace(/-/gi, "/")
							.replace(/(\w+)\/(\w+)\/(\w+)/, "$3/$2/$1")}
					</span>
				</div>
			</div>
			<div className="bottom">
				{user ? <h4>Precio Total:</h4> : <h4>Usuario: {order.user.email}</h4>}
				<div className="left">
					<div className="details">
						<p className="priceproductcard">${total}</p>
					</div>
					{!user &&
						(status === "creada" ? (
							<button
								className="btn btn-light pill-rounded"
								onClick={() => handleProcess(order)}
							>
								Procesar
							</button>
						) : status === "procesando" ? (
							<button
								className="btn btn-light pill-rounded"
								onClick={() => handleComplete(order)}
							>
								Completar
							</button>
						) : status === "completa" ? (
							<h3>
								<span className="badge badge-success">Completa</span>{" "}
							</h3>
						) : (
							<h3>
								<span className="badge badge-danger">Cancelada</span>
							</h3>
						))}
					{status !== "cancelada" && (
						<button
							className="btn btn-danger pill-rounded"
							onClick={() => handleCancel(order)}
						>
							Cancelar
						</button>
					)}
					{order.checkouts[0] && (
						<button className="btn btn-success pill-rounded" onClick={toggle}>
							Datos de envío
						</button>
					)}
				</div>
			</div>
			{/*----------------------------------------*/}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle} className="box-title check-orden">
					<ModalBody style={{ fontWeight: "normal" }}>
						<h3 style={{ textAlign: "center", width: "100%" }}>Datos de envío</h3>
						<div>
							<label>
								<b>Provincia:</b> {order.checkouts[0] && order.checkouts[0].provincia}
							</label>
						</div>
						<div>
							<label>
								<b>Departamento:</b>{" "}
								{order.checkouts[0] && order.checkouts[0].departamento}
							</label>
						</div>
						<div>
							<label>
								<b>Localidad:</b> {order.checkouts[0] && order.checkouts[0].localidad}
							</label>
						</div>
						<div>
							<label>
								<b>Dirección:</b> {order.checkouts[0] && order.checkouts[0].direccion}
							</label>
						</div>
						<div>
							<label>
								<b>Email:</b> {order.checkouts[0] && order.checkouts[0].email}
							</label>
						</div>
						<div>
							<label>
								<b>Teléfono:</b> {order.checkouts[0] && order.checkouts[0].telefono}
							</label>
						</div>
						<hr />
						<div style={{ display: "flex", flexDirection: "column" }}>
							<h4>Estado de pago: {order.checkouts[0].status}</h4>
							<label>
								Metodo de Pago:{" "}
								{order.checkouts[0].status === "Pendiente" ||
								order.checkouts[0].comprobante
									? "Efectivo"
									: order.checkouts[0].status === "Pagado" &&
									  !order.checkouts[0].comprobante
									? "Tarjeta"
									: ""}
							</label>
							{order.checkouts[0].comprobante && (
								<button className="btn btn-dark" onClick={toggleComp}>
									Ver comprobante
								</button>
							)}
						</div>
					</ModalBody>
				</ModalHeader>
			</Modal>
			<Modal isOpen={comp} toggle={toggleComp}>
				<ModalBody className="box-title check-orden">
					<img
						style={{ width: "100%" }}
						src={order.checkouts[0].comprobante}
						alt="comprobante"
					/>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default Orden;
