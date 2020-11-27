import axios from 'axios'

//CONSTANTES

const GET_CATEGORY = 'GET_CATEGORY'


// STATE

const initialState = {
    categories: [],
}

// REDUCER

export default function categoryReducer (state = initialState, action){
    switch(action.type){
        case GET_CATEGORY:
            return {
                ...state,
                categories: action.payload
            }
        default:
            return {
                ...state
            }
    }
}


// // ACTIONS

export const getCategory = () => async(dispatch) => { 
     try{
        const {data} = await axios.get('https://api-henrycomics.herokuapp.com/category/', { withCredentials: true })
        dispatch({
            type: GET_CATEGORY,
            payload: data
        })
     }catch(error){
        console.log(error)
     }
}