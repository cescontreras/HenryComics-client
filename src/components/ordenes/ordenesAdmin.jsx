import React, {useState, useEffect} from 'react';
import { ListGroup, ListGroupItem, Badge} from 'reactstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ordenesAdmin.css';
import Orden from '../ordenes/orden';

const OrderTable = () => {

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState();
  const [status, setStatus] = useState(); 
  const [statusG, setStatusG] = useState();
 
  useEffect(() => {
    getOrders(status)
  }, [status, statusG]);  
  
  const toggle = (order) => {     
    setOrder(order);        
  } 
  
  const getOrders = async (status) => {
    let query = '';
    if (status) {query = `?status=${status}`};
    const data = await axios.get(`https://api-henrycomics.herokuapp.com/orders${query}`, { withCredentials: true });   
    let filtered = data.data.filter(p => p.status !== 'carrito')   
    setOrders(filtered);
  } 

  const getOrder = async (id) => {
    const data = await axios.get(`https://api-henrycomics.herokuapp.com/orders/${id}`, { withCredentials: true });              
    setOrder(data.data[0]);
  }

  const handleStatus = (e) => {       
    setStatus(e.target.value);
    setOrder();  
  }

  return (
    <div>
      <div className='gral-order'>
        <div className='estados-select'>
          <div class="btn-group-vertical">
            <button type="button" class="btn btn-secondary" onClick={handleStatus}>Todas</button>
            {/* <button type="button" class="btn btn-secondary" value='carrito' onClick={handleStatus}>Carrito</button> */}
            <button type="button" class="btn btn-secondary" value='creada' onClick={handleStatus}>Creada</button>
            <button type="button" class="btn btn-secondary" value='procesando' onClick={handleStatus}>Procesando</button>
            <button type="button" class="btn btn-secondary" value='completa' onClick={handleStatus}>Completa</button>
            <button type="button" class="btn btn-secondary" value='cancelada' onClick={handleStatus}>Cancelada</button>
          </div> 
        </div>
        <div className='lista-orden'>
        <ListGroup>
          {
            orders && orders.map((order) => (
              <ListGroupItem tag="button" onClick={() => toggle(order)}>
              <Badge pill>{order.status}</Badge>
              {'Orden # '+ order.id}
              <span>{order.createdAt.split('T')[0].replace(/-/gi,'/').replace(/(\w+)\/(\w+)\/(\w+)/,"$3/$2/$1")}</span>        
              </ListGroupItem>         
            ))
          }    
        </ListGroup>
        </div>
        <div className='detalle-orden'>
        { 
          order && <Orden order={order} setStatusG={setStatusG} statusG={statusG} getOrder={getOrder}/>              
        }
        </div>
      </div>
    </div>
  )
}

export default OrderTable;