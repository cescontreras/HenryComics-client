import axios from "axios";

//CONSTANTES

const GET_ALLPRODUCTS = "GET_ALLPRODUCTS";
const GET_PRODUCTS = "GET_PRODUCTS";
const GET_SELPRODUCT = "GET_SELPRODUCT";
const FILTER_CATEGORIES = "FILTER_CATEGORIES";
const FILTER_PRODUCTS = "FILTER_PRODUCTS";
const FIND_PRODUCTS = "FIND_PRODUCTS";
const CLEAN = "CLEAN";
const url = "https://api-henrycomics.herokuapp.com/products";

// STATE

const initialState = {
	products: [],
	selProduct: {},
	statusFilter: false,
};

// REDUCER

export default function productReducer(state = initialState, action) {
	switch (action.type) {
		case GET_ALLPRODUCTS:
			return {
				products: action.payload,
				statusFilter: false,
			};
		case GET_PRODUCTS:
			return {
				products: action.payload,
				statusFilter: false,
			};
		case GET_SELPRODUCT:
			return {
				...state,
				selProduct: action.payload,
			};
		case FILTER_CATEGORIES:
			return {
				...state,
				products: action.payload,
				statusFilter: false,
			};

		case FILTER_PRODUCTS:
			return {
				products: action.payload,
				statusFilter: true,
			};
		case FIND_PRODUCTS:
			return {
				products: action.payload,
				statusFilter: false,
			};
		case CLEAN:
			return {
				...state,
				statusFilter: false,
			};
		default:
			return {
				...state,
				selProduct: {},
				statusFilter: false,
			};
	}
}

// ACTIONS

export const getProducts = () => async (dispatch) => {
	try {
		const { data } = await axios.get(url, { withCredentials: true });

		dispatch({
			type: GET_PRODUCTS,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const selProduct = (id) => async (dispatch) => {
	try {
		const { data } = await axios.get(`${url}/${id}`, { withCredentials: true });
		dispatch({
			type: GET_SELPRODUCT,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const findProducts = (arg) => async (dispatch) => {
	try {
		const {
			data,
		} = await axios.get(`${url}/search?text=${arg}`, {
			withCredentials: true,
		});
		dispatch({
			type: FIND_PRODUCTS,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const filterProducts = (products, propiedad, arg) => (dispatch) => {
	try {
		let data = products.filter((e) => e[arg] === propiedad);
		dispatch({
			type: FILTER_PRODUCTS,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const filterCategory = (id) => async (dispatch) => {
	try {
		const { data } = await axios.get(`${url}/category/${id}`, {
			withCredentials: true,
		});
		dispatch({
			type: FILTER_CATEGORIES,
			payload: data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const clean = () => (dispatch) => {
	dispatch({
		type: CLEAN,
	});
};
