import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { verifyLogin } from "./redux/users";
import NavBar from "./components/navBar/navBar";
import Catalog from "./components/catalogo/catalog";
import Product from "./components/productComponent/product";
import Admin from "./components/admin/admin";
import UserForm from "./components/userForm/userForm";
import LandingCarrousel from "./components/carrousel/carrousel";
import News from "./components/newsgrid/newsgrid";
import Footer from "./components/footer/footer";
import User from "./components/userPanel/userPanel";
import Login from "./components/userForm/login";
import Payment from "./components/checkout/paymentCard";
import SearchAPI from "./components/catalogoAPI/busquedaAPI";
import RecuperarPass from "./components/recuperarPass/recuperarPass";
import denegado from "./403.png";

function App() {

	const dispatch = useDispatch();
	const user = useSelector((store) => store.userState.userLogin);
	const products = useSelector((store) => store.productState.products);
	let onlyStock = products.filter((p) => p.stock > 0);

	useEffect(() => {
		console.log("app render");
		if (!user.login) {
			dispatch(verifyLogin());
		}
	}, [user]);

	return (
		<Router>
			<NavBar />
			<Route exact path="/" render={() => <LandingCarrousel />} />
			<Route exact path="/" render={() => <News />} />
			<Route exact path="/" render={() => <Footer />} />
			<Route
				exact
				path="/catalogo"
				render={() => (
					<Catalog
						products={
							onlyStock
						} 
					/>
				)}
			/>
			<Route
				exact
				path="/catalogo/category/:id"
				render={({ match }) => {
					return (
						<Catalog
							id={Number(match.params.id)}
							products={
								onlyStock
							} 
						/>
					);
				}}
			/>
			<Route
				exact
				path="/catalogo/search"
				render={({ location }) => (
					<Catalog
						products={onlyStock}
						search={
							location.search.split("=")[1]
						} 
					/>
				)}
			/>
			<Route
				exact
				path="/product/:id"
				render={({ match }) => <Product id={Number(match.params.id)} />}
			/>
			<Route
				exact
				path="/admin"
				render={() =>
					user.login && user.isAdmin ? (
						<div>
							<Admin 
							/>
						</div>
					) : (
						<div className="denied">
							<img src={denegado} atl="403" />
						</div>
					)
				}
			/>

			<Route
				exact
				path="/signup"
				render={() => (
					<div>
						<UserForm />
					</div>
				)}
			/>

			<Route
				exact
				path="/login"
				render={() => (
					<div>
						<Login />
					</div>
				)}
			/>

			<Route
				exact
				path="/user"
				render={() =>
					user.login ? (
						<User />
					) : (
						<div className="denied">
							<img src={denegado} atl="403" />
						</div>
					)
				}
			/>

			<Route
				exact
				path="/payment"
				render={({ location }) => (
					<Payment
						status={location.search.split("=")[1].split("&")[0]}
						checkID={location.search.split("=")[3]}
						ordenID={location.search.split("=")[2].split("&")[0]}
					/>
				)}
			/>

			<Route
				exact
				path="/resetPass"
				render={({ location }) => (
					<RecuperarPass id={location.search.split("=")[1]} />
				)}
			/>

			<Route exact path="/searchWish" render={() => <SearchAPI />} />
		</Router>
	);
}

export default App;
