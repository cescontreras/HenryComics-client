import React from 'react';
import { useState,useEffect } from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';

const Users = () => {

  const [users, setUsers] = useState([]);
  const userLogged = useSelector(store => store.userState.userLogin)

  useEffect(() => {
    getUsers();
    
  }, [])

  const getUsers = async () => {
    const {data} = await axios.get('https://api-henrycomics.herokuapp.com/user', { withCredentials: true })
    data.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }      
      return 0;
    })
    const users = data.filter(user => user.id !== userLogged.id)
    setUsers(users);
  }

  const promoteUser = async (id,status) => {

    await axios.post(`https://api-henrycomics.herokuapp.com/auth/promote/${id}?status=${status}`, null , { withCredentials: true })
    getUsers();
  }

  const deleteUser = async (id) => {
    await axios.delete(`https://api-henrycomics.herokuapp.com/user/${id}`, { withCredentials: true })
    getUsers();
  }

  return (
    <div className='tablaProd'>
      <table className='table table-hover'>
        <thead>
          <tr className='table table-hover'>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Permisos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users[0] && users.map(user=>{
            let status = !user.isAdmin
            return <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.isAdmin ? "Administrador" : "Usuario"}</td>
            <td className='table w-auto table-hover'>
              <button className="btn btn-secondary btn-sm m-2 p-1" onClick={() => promoteUser(user.id,status)}>{status ? 'Promover' : 'Revocar'}</button>
              <button className="btn btn-secondary btn-sm m-2 p-1" >Ordenes</button>
              <button className="btn btn-dark btn-sm m-2 p-1" onClick={() => deleteUser(user.id)}>Eliminar</button>
            </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users;
