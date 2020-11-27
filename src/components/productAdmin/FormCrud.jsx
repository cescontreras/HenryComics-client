import React, { useState } from "react";
import Select from "react-select";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Alert } from "reactstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const url = "https://api-henrycomics.herokuapp.com/products";

const FormCrud = ({
	get,
	editCategory,
	editIsOpen,
	deleteIsOpen,
	tipoAccion,
	product,
	setProducto,
	category,
	idProduct,
	productGet,
	setInsertarProducto,
	setEliminarProducto,
}) => {
	let opcion = [];
	let opcionEliminar = [];

	const [selectedOption, setSelectedOption] = useState([]);
	const [visible, setVisible] = useState(false);
	const [successPost, setSuccessPost] = useState();
	const [selectedDelete, setSelectedDelete] = useState([]);

	const peticionPostProducto = async () => {
		let body = {
			...product,
			name: product.name.toLowerCase(),
			author: product.author.toLowerCase(),
			description: product.description.toLowerCase(),
			serie: product.serie.toLowerCase(),
		};
		await axios
			.post(`${url}/create`, body, { withCredentials: true })
			.then((response) => {
				postCategoriProduct(response.data.newProduct.id);
				setSuccessPost(true);
				setVisible(true);
			})
			.catch((e) => {
				setSuccessPost(false);
				setVisible(true);
			});
	};

	const postCategoriProduct = async (idProduct) => {
		await selectedOption.forEach((ele) => {
			axios
				.post(`${url}/${idProduct}/category/${ele.id}`, null, {
					withCredentials: true,
				})
				.then((response) => {
					get();
				});
		});

		setInsertarProducto(false);
	};

	const deleteCategoriProduct = async () => {
		await selectedDelete.forEach((ele) => {
			axios.delete(`${url}/${product.id}/category/${ele.id}`, {
				withCredentials: true,
			});
		});
		get();
	};

	const peticionPut = async () => {
		const { data } = await axios.put(`${url}/${product.id}`, product, {
			withCredentials: true,
		});
		console.log(data);
		setInsertarProducto(false);
		get();
	};

	const producDelete = async () => {
		await axios
			.delete(`${url}/${idProduct}`, { withCredentials: true })
			.then((response) => {
				get();
				setEliminarProducto(false);
			});
	};

	if (category.length > 0) {
		category.forEach((e) => {
			opcion.push({ value: e.name, label: e.name, id: e.id });
		});
	}
	if (editCategory.length > 0) {
		editCategory.forEach((e) => {
			opcionEliminar.push({ value: e.name, label: e.name, id: e.id });
		});
	}

	const uploadImage = async (e) => {
		const file = e.target.files[0];
		const base64 = await convertBase64(file);
		setProducto({
			...product,
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

	const handleInputChange = (e) => {
	
		setProducto({
			...product,
			[e.target.name]: e.target.value,
		});
		console.log(product);
	};

	const onSubmit = (e) => {	
		e.preventDefault();

		if (tipoAccion === "agregar") {
			peticionPostProducto();
			setProducto({});
		} else {
			peticionPut();
			postCategoriProduct(product.id);
			deleteCategoriProduct();
		}
		setInsertarProducto(false);
		get();
	};

	const select = (
		<Select
			isMulti
			name="categorias"
			options={opcion}
			className="basic-multi-select"
			classNamePrefix="select"
			onChange={setSelectedOption}
		/>
	);

	const onDismiss = () => setVisible(false);

	return (
		<div>
			<Modal isOpen={editIsOpen}>
				<ModalHeader>
					<form className="form-group form-prod" onSubmit={onSubmit}>
						<ModalBody>
							<div>
								<p>Completá los datos correspondientes al nuevo producto.</p>
							</div>
							<div className="input-form">
								<label>Nombre:</label>
								<input
									className="form-control"
									className="form-control"
									type="text"
									name="name"
									onChange={handleInputChange}
									value={product && product.name}
								/>
							</div>
							<div className="input-form">
								<label>Autor:</label>
								<input
									className="form-control"
									type="text"
									name="author"
									onChange={handleInputChange}
									value={product && product.author}
								/>
							</div>
							<div className="input-form">
								<label>Collección:</label>
								<input
									className="form-control"
									type="text"
									name="collection"
									onChange={handleInputChange}
									value={product && product.collection}
								/>
							</div>
							<div className="input-form">
								<label>Año:</label>
								<input
									className="form-control"
									type="number"
									name="year"
									onChange={handleInputChange}
									value={product && product.year}
								/>
							</div>
							<div className="input-form">
								<label>Serie:</label>
								<input
									className="form-control"
									type="text"
									name="serie"
									onChange={handleInputChange}
									value={product && product.serie}
								/>
							</div>
							<div className="input-form">
								<label>Precio:</label>
								<input
									className="form-control"
									type="number"
									name="price"
									min="0"
									onChange={handleInputChange}
									value={product && product.price}
								/>
							</div>
							<div className="input-form">
								<label>Stock:</label>
								<input
									className="form-control"
									type="number"
									name="stock"
									min="0"
									onChange={handleInputChange}
									value={product && product.stock}
								/>
							</div>
							<div className="desc-form">
								<label>Descripción:</label>
								<textarea
									className="form-control"
									name="description"
									onChange={handleInputChange}
									value={product && product.description}
								/>
							</div>
							<div className="input-form">
								<label>Imagen:</label>
								<input
									type="file"
									name="image"
									onChange={uploadImage}
								/>
							</div>
							<div className="cate-form">
								<label>Agregar categoría:</label>
								{select}
							</div>
							{tipoAccion !== "agregar" && (
								<div className="cate-form">
									<label>Eliminar categoría:</label>
									<Select
										isMulti
										name="categorias"
										options={opcionEliminar}
										className="basic-multi-select"
										classNamePrefix="select"
										onChange={setSelectedDelete}
									/>
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							{tipoAccion === "agregar" ? (
								<button className="btn btn-dark" type="submit">
									Agregar
								</button>
							) : (
								<button className="btn btn-secondary" type="submit">
									Editar
								</button>
							)}
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => setInsertarProducto(false)}
							>
								Cancelar
							</button>
						</ModalFooter>
					</form>
				</ModalHeader>
			</Modal>

			<Modal isOpen={deleteIsOpen}>
				<ModalBody>¿Estás seguro que deseas eliminar el producto?</ModalBody>
				<ModalFooter>
					<button
						className="btn btn-danger"
						onClick={() => {
							producDelete();
						}}
					>
						Si
					</button>
					<button
						className="btn btn-secundary"
						onClick={() => {
							setEliminarProducto(false);
						}}
					>
						No
					</button>
				</ModalFooter>
			</Modal>
			{successPost ? (
				<Alert color="success" isOpen={visible} toggle={onDismiss}>
					¡Operación exitosa!
				</Alert>
			) : (
				<Alert color="danger" isOpen={visible} toggle={onDismiss}>
					Error, debe llenar todos los campos.
				</Alert>
			)}
		</div>
	);
};

export default FormCrud;
