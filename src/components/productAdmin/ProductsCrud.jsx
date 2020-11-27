import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { getProducts } from '../../redux/productos';
import { getCategory } from '../../redux/categorias';
import axios from 'axios';
import FormCrud from './FormCrud';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productCrud.css';


const url = 'https://api-henrycomics.herokuapp.com/products';
const urlCategori ='https://api-henrycomics.herokuapp.com/category/';

const ProductsCrud = (/*{get}*/) =>{

    const dispatch = useDispatch();
    const productGet = useSelector(store => store.productState.products)
    console.log(productGet)
    const categoryGet = useSelector(store => store.categoryState.categories)

    //estado:
    //const [productGet, setProductGet]=useState([]);
    //const [categoria,setCategoria] = useState([])
    const [insertarProducto, setInsertarProducto] = useState(false)
    const [eliminarProducto, setEliminarProducto] = useState(false)
    const [tipoAccion, setTipoaccion] = useState(null)
    const [idProduct, setIdProduct] = useState(null)
    const [producto,setProducto] =useState({});
    const [editCategory, setEditCategory] =useState([]);

    useEffect(()=>{
        dispatch(getProducts())   
    },[])

    const handleChange =()=>{ // Aqui se va definir que tipo de boton tendra el form si es asgregar o actualizar 
        setTipoaccion('agregar');
        setInsertarProducto(true);
        setProducto({})
        //getCategories();
        dispatch(getCategory())
    }
    const handleChangeDelete =(id)=>{
        setEliminarProducto(true)
        setIdProduct(id)
    }
    const hangleChangeEdit = (ele)=>{
        setTipoaccion(null);
        setInsertarProducto(true);
        //getCategories();
        dispatch(getCategory())
        setEditCategory(ele.categories)
        setProducto(ele);
        console.log(ele)
    }

    const capitalize = (string) => {
        return string.substring(0, 1).toUpperCase() + string.substring(1);
    }

    return (
        <div>
            <button className="btn btn-secondary m-3" onClick={()=>handleChange()} >Agregar producto</button> {/* Abre una  ventana con el formulario para agregar prductos */}

            <div className='tablaProd'>
                <table className='table table-hover '>
                    <thead>
                        <tr className='table table-hover'>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>precio</th>
                            <th>Stock</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productGet[0] && productGet.map(ele=>(
                            <tr>
                            <td>{ele.id}</td>
                            <td>{capitalize(ele.name)}</td>
                            <td>{ele.price}</td>
                            <td>{ele.stock}</td>
                            <td className='table w-auto table-hover'>
                                <button className="btn btn-secondary btn-sm m-2 p-1" onClick={()=>{hangleChangeEdit(ele)}} >Editar</button>
                                <button className="btn btn-dark btn-sm m-2 p-1" onClick={()=>{handleChangeDelete(ele.id)}}>Eliminar</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <FormCrud
                get={()=>dispatch(getProducts())}
                editIsOpen={insertarProducto}
                deleteIsOpen={eliminarProducto}
                tipoAccion={tipoAccion}
                //productGetApi={productGetApi}
                product={producto}
                setProducto={setProducto}
                category={categoryGet}
                idProduct={idProduct}
                // setProductGet={setProductGet}
                productGet={productGet}
                setInsertarProducto={setInsertarProducto}
                setEliminarProducto={setEliminarProducto}
               // setCategoria={setCategoria}
                editCategory={editCategory}              
            />
        </div>
    )

}

export default ProductsCrud;