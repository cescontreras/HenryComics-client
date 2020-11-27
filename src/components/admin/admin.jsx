import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import "./admin.css";
import AgregarCategorias from "../categoryAdmin/AgregarCategorias";
import ProductsCrud from "../productAdmin/ProductsCrud";
import Users from "../usersAdmin/users";
import OrderTable from "../ordenes/ordenesAdmin";
import Wishlist from "../wishlistAdmin/wishlist";
import classnames from "classnames";

const Admin = () => {
	const [activeTab, setActiveTab] = useState("1");

	const toggle = (tab) => {
		if (activeTab !== tab) setActiveTab(tab);
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
						Categorias
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
						Productos
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
						Ordenes
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
						Usuarios
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === "5" })}
						onClick={() => {
							toggle("5");
						}}
						type="button"
					>
						Wishlist
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId="1">
					<AgregarCategorias />
				</TabPane>
				<TabPane tabId="2">
					<ProductsCrud />
				</TabPane>
				<TabPane tabId="3">
					<OrderTable />
				</TabPane>
				<TabPane tabId="4">
					<Users />
				</TabPane>
				<TabPane tabId="5">
					<Wishlist />
				</TabPane>
			</TabContent>
		</div>
	);
};

export default Admin;
