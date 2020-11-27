import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { cleanCart } from "../../redux/carrito";

const Checkout = ({ modal, toggle, id, items, user }) => {

	const [link, setLink] = useState("");

	const dispatch = useDispatch();
	const [location, setLocation] = useState({
		provincias: [],
		departamentos: [],
		localidades: [],
	});

	const [input, setInput] = useState({
		provincia: "",
		departamento: "",
		localidad: "",
		direccion: "",
		email: "",
		telefono: "",
	});

	const getLink = async () => {
		const user = await axios.get("https://api-henrycomics.herokuapp.com/auth/me", {
			withCredentials: true,
		});
		let body = {
			items: items,
			payer: user.data,
			checkout: input,
		};

		const { data } = await axios.post(
			`https://api-henrycomics.herokuapp.com/orders/api/v1/mercadopago`,
			body
		);		
		setLink(data.init_point);
	};

	const getProvincias = async () => {
		const { data } = await axios.get(
			`https://apis.datos.gob.ar/georef/api/provincias`
		);
		setLocation({
			provincias: data.provincias,
			departamentos: [],
			localidades: [],
		});
	};

	const getDepartamentos = async (provincia) => {	
		const { data } = await axios.get(
			`https://apis.datos.gob.ar/georef/api/departamentos?provincia=${provincia}`
		);
		setLocation({
			...location,
			departamentos: data.departamentos,
			localidades: [],
		});
	};

	const getLocalidades = async (departamento) => {	
		const { data } = await axios.get(
			`https://apis.datos.gob.ar/georef/api/localidades?provincia=${input.provincia}&departamento=${departamento}`
		);
		setLocation({
			...location,
			localidades: data.localidades,
		});
	};

	useEffect(() => {
		if (modal && !location.provincias[0]) {		
			getProvincias();
			setInput({
				...input,
				email: user.email,
			});
		} else if (input.provincia && !input.departamento) {
			console.log("render 2");		
		} else if (input.departamento && !input.localidad) {
			console.log("render 3");			
		}		
	}, [input.provincia, input.departamento, input.localidad, modal]);

	const handleInputChange = (e) => {
		if ("provincia" === e.target.name) {
			setInput({
				...input,
				provincia: e.target.value,
				departamento: "",
				localidad: "",
			});
			getDepartamentos(e.target.value);
		} else if ("departamento" === e.target.name) {
			setInput({
				...input,
				departamento: e.target.value,
				localidad: "",
			});
			getLocalidades(e.target.value);
		} else if ("localidad" === e.target.name) {
			setInput({
				...input,
				localidad: e.target.value,
			});
		} else {
			setInput({
				...input,
				[e.target.name]: e.target.value,
			});
		}
	};

	const confirmBuy = async () => {
		try {
			await axios.put(`https://api-henrycomics.herokuapp.com/orders/${id}?status=creada`);
			axios
				.post(`https://api-henrycomics.herokuapp.com/orders/${id}/checkout`, input)
				.then((check) => {
					localStorage.setItem(
						"checkout",
						JSON.stringify([id, check.data.response.id])
					);
					dispatch(cleanCart());
					toggleRed();
					toggle();
					setInput({
						provincia: "",
						departamento: "",
						localidad: "",
						direccion: "",
						email: "",
						telefono: "",
					});
				});
		} catch (err) {
			console.log(err);
		}		
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const [redirect, setRedirect] = useState(false);
	const toggleRed = () => setRedirect(!redirect);

	const continuar = () => {
		getLink();
		toggleRed();
	};

	return (
		<Fragment>
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle} className="box-title check-form">
					<form className="form-group form-prod" onSubmit={handleSubmit}>
						<ModalBody>
							<div>
								<p>Completá los datos de envío correspondientes.</p>
							</div>
							<div className="cate-form">
								<label>Provincia *:</label>
								<select
									className="form-control"
									name="provincia"
									onChange={handleInputChange}
								>
									<option>---Seleccione Provincia---</option>
									{location.provincias[0] &&
										location.provincias.map((p) => (
											<option value={p.nombre}>{p.nombre}</option>
										))}
								</select>
							</div>
							<div className="cate-form">
								<label>Departamento *:</label>
								<select
									className="form-control"
									name="departamento"
									onChange={handleInputChange}
								>
									<option>---Seleccione Departamento---</option>
									{location.departamentos[0] &&
										location.departamentos.map((p) => (
											<option value={p.nombre}>{p.nombre}</option>
										))}
								</select>
							</div>
							<div className="cate-form">
								<label>Localidad *:</label>
								<select
									className="form-control"
									name="localidad"
									onChange={handleInputChange}
								>
									<option>---Seleccione Localidad---</option>
									{location.localidades[0] &&
										location.localidades.map((p) => (
											<option value={p.nombre}>{p.nombre}</option>
										))}
								</select>
							</div>
							<div className="input-form">
								<label>Dirección *:</label>
								<input
									className="form-control"
									type="text"
									name="direccion"
									onChange={handleInputChange}
									value={input.direccion}
								/>
							</div>
							<div className="input-form">
								<label>Email *:</label>
								<input
									className="form-control"
									type="text"
									name="email"
									onChange={handleInputChange}
									value={input.email}
								/>
							</div>
							<div className="input-form">
								<label>Teléfono:</label>
								<input
									className="form-control"
									type="number"
									name="telefono"
									onChange={handleInputChange}
									value={input.telefono}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<button
								type="buton"
								className="btn btn-secondary"
								onClick={continuar}
								disabled={!input.email || !input.localidad ? true : false}
							>
								Continuar
							</button>
						</ModalFooter>
					</form>
				</ModalHeader>
			</Modal>
			<Modal
				isOpen={redirect}
				toggle={toggleRed}
				style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
			>
				<ModalHeader
					className="box-title check-orden"
					style={{ textAlign: "center" }}
				>
					Serás redirigido a la plataforma de pago
				</ModalHeader>
				<ModalBody style={{ display: "flex", justifyContent: "space-around" }}>
					<button type="button" className="btn btn-danger" onClick={toggleRed}>
						Cancelar
					</button>
					<a
						type="button"
						href={link}
						target="_blank"
						className="btn btn-dark"
						onClick={confirmBuy}
					>
						Aceptar
					</a>
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default Checkout;
