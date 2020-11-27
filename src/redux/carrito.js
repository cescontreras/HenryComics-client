import axios from "axios";

import { id } from "./users";

//CONSTANTES

const GET_CARRITO = "GET_CARRITO";
const GET_LOCAL_CARRITO = "GET_LOCAL_CARRITO";
const MIGRAR_DATA = "MIGRAR_DATA";

// STATE

const initialState = {
	carritoProducts: [],
	carritoInfo: {
		id: "",
	},
};

// REDUCER

export default function carritoReducer(state = initialState, action) {
	switch (action.type) {
		case GET_CARRITO:
			return {
				...state,
				carritoProducts: action.payload.products,
				carritoInfo: {
					id: action.payload.id,
					userId: action.payload.userId,
				},
			};
		case GET_LOCAL_CARRITO:
			return {
				...state,
				carritoProducts: action.payload,
				carritoInfo: {
					id: 0,
					userId: "GUEST",
				},
			};
		case MIGRAR_DATA:
			return {
				...state,
				carritoProducts: [],
			};
		default:
			return {
				...state,
			};
	}
}

// // ACTIONS
export let productos;
export const getCarrito = (userId) => async (dispatch) => {
	try {
		const { data } = await axios.get(
			`https://api-henrycomics.herokuapp.com/user/${userId}/cart`,
			{ withCredentials: true }
		);
		productos = data.products;
		dispatch({
			type: GET_CARRITO,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getLocalCarrito = () => (dispatch) => {
	const data = JSON.parse(localStorage.getItem("carrito"));
	dispatch({
		type: GET_LOCAL_CARRITO,
		payload: data,
	});
};

export const localToUser = (carrito) => async (dispatch) => {
	try {		
		carrito.map(async (p) => {
			await axios.post(`https://api-henrycomics.herokuapp.com/user/${id}/cart`, p, {
				withCredentials: true,
			});
		});
		dispatch({
			type: MIGRAR_DATA,
		});
	} catch (err) {
		console.log(err);
	}
};

export const cleanCart = () => (dispatch) => {
	dispatch({
		type: MIGRAR_DATA,
	});
};
