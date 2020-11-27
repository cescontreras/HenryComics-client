import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, CardBody, Card } from "reactstrap";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./filter.css";
import { filterProducts as filter, clean } from "../../../redux/productos";

const Filter = ({ products, id, page, status, pageStatus }) => {
	const dispatch = useDispatch();

	const [filtro, setFiltro] = useState(false);
	const [collection, setCollection] = useState(false);
	const [serie, setSerie] = useState(false);
	const [year, setYear] = useState(false);

	const toggleF = () => {
		setFiltro(!filtro);
		setCollection(false);
		setSerie(false);
		setYear(false);
	};

	const toggleA = () => setCollection(!collection);
	const toggleE = () => setSerie(!serie);
	const toggleY = () => setYear(!year);

	const [filtros, setFiltros] = useState({
		collection: [],
		serie: [],
		año: [],
	});

	const getFilterList = () => {
		let newCollections = products[0] && products.map((p) => p.collection);
		let newSeries = products[0] && products.map((p) => p.serie);
		let newAño = products[0] && products.map((p) => p.year);
		setFiltros({
			...filtros,
			collection: [...new Set(newCollections)],
			serie: [...new Set(newSeries)],
			año: [...new Set(newAño)],
		});
	};

	const capitalize = (str) => {
		return str.toString().split(' ').map(a => a.substring(0, 1).toUpperCase() + a.substring(1)).join(' ')
	}

	useEffect(() => {
		getFilterList();
	}, [products]);

	return (
		<div className="filter-fixed filtros-prod">
			<div className="filter-header">
				<h5 onClick={toggleF} className="cursor">
					<FontAwesomeIcon icon={faFilter} /> Filtros
				</h5>
				{status && (
					<a
						type="button"
						onClick={() => {
							dispatch(clean(id));
							page(1);
							pageStatus(false);
						}}
					>
						<FontAwesomeIcon icon={faTrash} color="#dc3545" />
					</a>
				)}
			</div>
			<Collapse isOpen={filtro}>
				<Card style={{ backgroundColor: "#dc3545" }}>
					<CardBody className="body">
						<h5 onClick={toggleA} className="cursor">
							Collección
						</h5>
						<Collapse isOpen={collection}>
							<Card>
								<CardBody>
									<ul className="filtro">
										{filtros.collection[0] &&
											filtros.collection.map((a) => (
												<li className="lista">
													<a
														name={a}
														type="button"
														onClick={() => {
															dispatch(filter(products, a, "collection"));
															page(1);
														}}
													>
														{capitalize(a)}
													</a>
												</li>
											))}
									</ul>
								</CardBody>
							</Card>
						</Collapse>
						<h5 onClick={toggleE} className="cursor">
							Serie
						</h5>
						<Collapse isOpen={serie}>
							<Card>
								<CardBody>
									<ul className="filtro">
										{filtros.serie[0] &&
											filtros.serie.map((a) => (
												<li className="lista">
													<a
														name={a}
														type="button"
														onClick={() => {
															dispatch(filter(products, a, "serie"));
															page(1);
														}}
													>
														{capitalize(a)}
													</a>
												</li>
											))}
									</ul>
								</CardBody>
							</Card>
						</Collapse>
						<h5 onClick={toggleY} className="cursor">
							Año
						</h5>
						<Collapse isOpen={year}>
							<Card>
								<CardBody>
									<ul className="filtro">
										{filtros.año[0] &&
											filtros.año.map((a) => (
												<li className="lista">
													<a
														name={a}
														type="button"
														onClick={() => {
															dispatch(filter(products, a, "year"));
															page(1);
														}}
													>
														{capitalize(a)}
													</a>
												</li>
											))}
									</ul>
								</CardBody>
							</Card>
						</Collapse>
					</CardBody>
				</Card>
			</Collapse>
		</div>
	);
};

export default Filter;
