import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Table } from "reactstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AgregarCategorias.css";
import { getCategory } from "../../redux/categorias";

const url = "https://api-henrycomics.herokuapp.com/category/";

const AgregarCategorias = () => {
	const categories = useSelector((store) => store.categoryState.categories);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCategory());
	}, []);

	// ------------ALERTS--------------------
	const [successPost, setSuccessPost] = useState();
	const [visible, setVisible] = useState(false);

	//-----------INPUT CHANGE------------------
	const [categorie, setCategorie] = useState({
		name: "",
		description: "",
	});

	const handleInputChange = (e) => {		
		setCategorie({
			...categorie,
			[e.target.name]: e.target.value,
		});
	};

	const hangleChangeEdit = (e) => {	
		setCategorie(e);
	};

	//------------CRUD----------------------
	const postCategorie = async () => {
		try {
			await axios.post(url, categorie, { withCredentials: true });
			setSuccessPost(true);
			setVisible(true);
			dispatch(getCategory());
		} catch (e) {
			setSuccessPost(false);
			setVisible(true);
		}
	};

	const handleChangeDelete = async (e) => {	
		try {
			await axios.delete(`https://api-henrycomics.herokuapp.com/category/${e}`, {
				withCredentials: true,
			});
			setSuccessPost(true);
			setVisible(true);
		} catch (e) {
			setSuccessPost(false);
			setVisible(true);
		}
		dispatch(getCategory());
	};

	const handleSave = async () => {	
		await axios.put(`https://api-henrycomics.herokuapp.com/category/${categorie.id}`, categorie, {
			withCredentials: true,
		});
		dispatch(getCategory());
	};

	const onSubmit = (e) => {		
		e.preventDefault();
		setCategorie({
			name: "",
			description: "",
		});
	};

	const onDismiss = () => setVisible(false);

	return (
		<div className="formCategories">
			<div className="row justify-content-left">
				<div className="col-sm-4 flex-start	">
					<form className="formCat" onSubmit={onSubmit}>
						<h3>Crear Categoría</h3>
						<p>
							Completa el formulario con la información necesaria para agregar una
							nueva categoría de producto.
						</p>
						<div className="form-group">
							<label>Nombre de la nueva categoría:</label>
							<br />
							<input
								className="form-control"
								type="text"
								name="name"
								onChange={handleInputChange}
								value={categorie.name}
							/>
						</div>
						<div className="form-group">
							<label>Descripción:</label>
							<br />
							<textarea
								className="form-control"
								name="description"
								onChange={handleInputChange}
								value={categorie.description}
							/>
						</div>
						<button class="btn btn-secondary" type="submit" onClick={postCategorie}>
							Crear nueva categoría
						</button>
						{categorie.id && (
							<button
								class="btn btn-primary"
								type="submit"
								onClick={() => handleSave()}
							>
								Guardar
							</button>
						)}
					</form>
					{successPost ? (
						<Alert
							className="alert"
							color="success"
							isOpen={visible}
							toggle={onDismiss}
						>
							¡Operacion exitosa!
						</Alert>
					) : (
						<Alert
							className="alert"
							color="danger"
							isOpen={visible}
							toggle={onDismiss}
						>
							Error !!
						</Alert>
					)}
				</div>
				<div>
					<Table bordered>
						<thead>
							<tr>
								<th>Id</th>
								<th>Nombre</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{categories &&
								categories.map((ele) => (
									<tr>
										<td>{ele.id}</td>
										<td className="w-50">{ele.name}</td>
										<td style={{ width: "300px" }}>
											<button
												className="btn btn-secondary btn-sm m-2 p-1"
												onClick={() => {
													hangleChangeEdit(ele);
												}}
											>
												Editar
											</button>
											<button
												className="btn btn-dark btn-sm m-2 p-1"
												onClick={() => {
													handleChangeDelete(ele.id);
												}}
											>
												Eliminar
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default AgregarCategorias;
