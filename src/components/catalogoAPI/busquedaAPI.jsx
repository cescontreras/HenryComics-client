import React, { Fragment, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import "./wish.css";
import ProductAPI from "./productosAPI";
import loader from "./marvel_loader.gif";

export default function SearchAPI() {
	const [searchText, setSearchText] = useState("");
	const [buscados, setBuscados] = useState([]);

	const [page, setPage] = useState(1);
	const [counter, setCounter] = useState("");
	const limit = 8;

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		let text = e.currentTarget.value;
		setSearchText(text);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		await handleSearch(1);
		setPage(1);
		setLoading(false);
	};

	const handleSearch = async (pagina) => {
		const { data } = await axios.get(
			`https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issues/?format=json&api_key=3067a5d595113ed2107c1651ac9856c2471f19fa&filter=name:${searchText}&limit=${limit}&offset=${
				(pagina - 1) * limit
			}&field_list=name,issue_number,image,volume&sort=cover_date:desc`
		);
		setBuscados(data.results);
		setCounter(Math.ceil(data.number_of_total_results / limit));
	};
	//-------------------------------------------FILTRO-------------------------------------//
	const handlePageChange = async (event, value) => {
		setLoading(true);
		setPage(value);
		await handleSearch(value);
		setLoading(false);
	};

	return (
		<div
			className="catalogo"
			style={{ flexDirection: "column", alignItems: "center" }}
		>
			<form class="form-inline my-2 my-lg-0 m-4" onSubmit={handleSubmit}>
				<input
					class="form-control mr-sm-2"
					type="search"
					placeholder="Buscar..."
					aria-label="Search"
					value={searchText}
					onChange={handleChange}
				/>
				<button class="btn btn-danger my-2 my-sm-0" type="submit">
					Buscar en API
				</button>
			</form>
			<div className="products" style={{ alignItems: "center" }}>
				{loading ? (
					<div className="divload">
						<img src={loader} alt="loader" className="load" />
					</div>
				) : (
					<Fragment>
						{buscados[0] && (
							<Pagination
								className="my-3"
								count={counter}
								page={page}
								siblingCount={1}
								boundaryCount={1}
								variant="outlined"
								shape="rounded"
								onChange={handlePageChange}
							/>
						)}
						<div className="products-content">
							{buscados.map((p) => (
								<ProductAPI product={p} />
							))}
						</div>
						{buscados[0] && (
							<Pagination
								className="my-3"
								count={counter}
								page={page}
								siblingCount={1}
								boundaryCount={1}
								variant="outlined"
								shape="rounded"
								onChange={handlePageChange}
							/>
						)}
					</Fragment>
				)}
			</div>
		</div>
	);
}
