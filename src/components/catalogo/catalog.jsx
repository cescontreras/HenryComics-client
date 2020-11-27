import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import "./catalog.css";
import { filterCategory, findProducts, getProducts } from "../../redux/productos";
import ProductCard from "../productComponent/productCard.jsx";
import Filter from "./filter/filter";
import Carrito from "./carrito/carrito.jsx";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function Catalog({ products, id, search }) {
	const classes = useStyles();
	const status = useSelector((store) => store.productState.statusFilter);
	const dispatch = useDispatch();
	const user = useSelector((store) => store.userState.userLogin);

	// -------PAGINACION-------
	const [page, setPage] = useState(1);
	const [paginated, setPaginated] = useState();
	const [pageStatus, setPageStatus] = useState(false);

	const limit = 8;

	const counter = Math.ceil(products.length / limit);

	const paginator = (e) => {
		let newArr = products.slice((e - 1) * limit, limit * e);
		setPaginated(newArr);
		setPageStatus(false);
	};

	const handlePageChange = (event, value) => {
		setPage(value);
		setPageStatus(true);
	};
	// ---------------------------------------------

	useEffect(() => {
		
		if (!status) {		
			const fetchData = async () => {
				if (id) {
					dispatch(filterCategory(id));	
					return setPageStatus(true);
				} else if (search) {					
					await dispatch(findProducts(search));
					return setPageStatus(true);
				} else {
					dispatch(getProducts());				
					return setPageStatus(true);
				}
			};
			fetchData();
		}
	}, [status, id, search]);

	useEffect(() => {		
		paginator(page);	
	}, [page, products]);

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
		<div className="catalogo">
			<div className="filter">
				<Filter
					products={products}
					status={status}
					id={id}
					page={setPage}
					pageStatus={setPageStatus}
				/>
			</div>
			<div className="products">
				<div className="products-content">
					{paginated &&
						paginated.map((p) => <ProductCard product={p} capitalize={capitalize} />)}
				</div>
				<div className={classes.root} id="pagination">
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
					<ul class="nav">
						<li class="nav-item p-3">
							<p>¿No encontrás el producto que querés? Buscalo y agregalo a tu</p>
						</li>
						<li class="nav-item">
							<a class="nav-link" tabindex="-1">
								<button type="button" class="btn btn-dark">
									<Link to="/searchWish" id="redtext">
										Wishlist
									</Link>
								</button>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="carrito">
				<Carrito user={user} />
			</div>
		</div>
	);
};
