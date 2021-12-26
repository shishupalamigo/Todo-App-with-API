import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
function SingleTodo(props) {
  const user = props.user;
  // console.log(user, "user from Single todo");
  let { id } = useParams();

  // console.log(id, 'Id from Param');
  const [todo, setTodo] = useState(null);

  const navigate = useNavigate();
  let storageKey = localStorage['app__user'];
  
  

  useEffect(() => {
    function fetchData () {
      fetch(`http://localhost:5050/api/todo/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          authorization: `${storageKey}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            console.log("running fetch data");
            return res.json();
          }
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        })
        .then((data) => setTodo(data.singleTodo))
        .catch((errors) => console.log(errors));
      };
      fetchData();
    // return () => {};
  }, [id, storageKey]);

  function handleDelete(id) {
    fetch(`http://localhost:5050/api/todo/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        authorization: `${storageKey}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then(({ errors }) => {
          return Promise.reject(errors);
        });
      })
      .then((data) => {
        console.log(data);
        navigate('/');
      })
      .catch((errors) => console.log(errors));
  }

  return (
    <div className='flex w-full justify-center'>
      {todo && (
        <div className='p-10 bg-slate-300'>
          <h1 className='text-2xl text-center mb-10'>{todo.title}</h1>
          <p className='text-xl'>Description: {todo.description}</p>
          <p>{moment(todo.createdAt).format('dddd, DD-MM-YYYY')}</p>
          {todo.author.name && <h3>Author: {todo.author.name}</h3>}
          {todo.author.email && todo.author.email === user.email && (
            <div className='flex justify-between mt-5'>
              <Link exact="true" to={`/edit/${todo._id}`} state={todo} className='border p-1 text-green-600'>Edit</Link>
              <button onClick={() => handleDelete(todo._id)} className='border p-1 text-red-600'>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default SingleTodo;
