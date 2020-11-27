import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, Link} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import {FormGroup, Form, Label} from 'reactstrap';
import GoogleButton from 'react-google-button'
import { FacebookLoginButton } from "react-social-login-buttons";
import './login.css'
import { getLogin } from '../../redux/users';
import {localToUser} from '../../redux/carrito'

const Login =() =>{

  const dispatch = useDispatch();
  const history = useHistory()
  const {register, errors, handleSubmit} = useForm();
  const carrito =  useSelector(store => store.carritoState.carritoProducts);
  const user = useSelector((store) => store.userState.userLogin.login);

  useEffect(()=>{
    if(user){
      history.push('/')
    }
  },[user])

  const onSubmit = async (arg, e) =>{
    
    try{
      await dispatch(getLogin(arg));
      await dispatch(localToUser(carrito))
      localStorage.removeItem('carrito');
      e.target.reset();
    }catch(err){
      console.log(err)
    }   
  }   
    return(
      <div className="col-sm-6 order-sm-2 offset-sm-1 mt-5">
        <h3>Iniciar sesión</h3>
        <Form
        action="/login" 
        method="post" 
        onSubmit={handleSubmit(onSubmit)} 
        >
          <FormGroup>
            <Label>Nombre de usuario</Label>
            <input 
              id='login-input'
              placeholder="nombre de usuario"
              name="username"
              className="form-control col-4"
              ref={register({
                required:{
                  value:true,
                  message:"Usuario es requerido."
                }                
              })}
            />
            <span className="text-danger text-small d-block mb-2">
              {errors?.username?.message}
            </span>
          </FormGroup>
          <FormGroup>
            <Label>Contraseña</Label>
            <input
              id='login-input'
              placeholder="Contraseña"
              name="password"
              type='password'
              className="form-control col-4"
              ref={register({
                required:{
                  value:true,
                  message:'Contraseña es requerida.'
                }
              })}
            />
            <span className="text-danger text-small d-block mb-2">
              {errors?.password?.message}
            </span>
            <Link to='/resetPass' style={{fontSize:'small',marginLeft:'10px'}}>Recuperar usuario o contraseña</Link>
          </FormGroup>
          
          <button type="submit" className="btn btn-danger">Iniciar sesión</button> 
        </Form>
        <hr />    
          <a href='https://api-henrycomics.herokuapp.com/auth/google' className='link'>
            <GoogleButton type='light'/>
          </a>
        <a href='https://api-henrycomics.herokuapp.com/auth/facebook' className='link'>
            <FacebookLoginButton className='facebook'/>
          </a>
      </div>
    )
}

export default Login