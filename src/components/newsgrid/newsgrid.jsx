import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./newsgrid.css";
import { getProducts } from "../../redux/productos";
import NewProduct from "./newproduct";

export default function News() {

	const dispatch = useDispatch();
	const products = useSelector((store) => store.productState.products);
	const [nuevosProductos, setNuevosProductos] = useState([]);

	useEffect(() => {
		dispatch(getProducts());
	}, []);

	useEffect(() => {
		let productsIndex = products.length;
		let ultimosTres = products.slice(productsIndex - 3, productsIndex);
		setNuevosProductos(ultimosTres);
	}, [products]);

	return (
		<div className="container-fluid grid">
			<h2 className="text-md-left font-weight-bold estrenos">ESTRENOS</h2>
			<div className="row" id="estren">
				{nuevosProductos.map((p) => (
					<Link to={"/catalogo"}>
						<div className="col-4">
							<NewProduct product={p} />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
