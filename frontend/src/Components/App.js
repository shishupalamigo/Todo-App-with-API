import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './Signup';
import Signin from './Signin';
import Header from './Header';
import Home from './Home';
import SingleTodo from './SingleTodo';
import EditTodo from './EditTodo';

function App() {
  const [state, setState] = useState({
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  });
  const [todos, setTodos] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);

  function signout() {
    setState({ isLoggedIn: false, user: null, isVerifying: true });
    localStorage.removeItem('app__user');
  }
  useEffect(() => {
    fetch('http://localhost:5050/api/todo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
      .then((data) => setTodos(data.todos))
      .catch((errors) => console.log(errors));
  },[]);

  let storageKey = localStorage['app__user'];

  useEffect(() => {
    // let storageKey = localStorage['app__user'];
    if (storageKey) {
      fetch('http://localhost:5050/api/users', {
        method: 'GET',
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
        .then(({ user }) => updateUser(user))
        .catch((errors) => console.log(errors));
    } else {
      setState({ isVerifying: false });
    }
  }, [storageKey]);


  function updateUser(user) {
    setState({ isLoggedIn: true, user, isVerifying: false });
    localStorage.setItem('app__user', user.token);
  }
  function handleCheckboxChange(id) {
    fetch(`http://localhost:5050/api/todo/isdone/${id}`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        // 'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        Accept: '*',
        authorization: `${storageKey}`,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then(({ errors }) => {
          return Promise.reject(errors);
        });
      })
      .then((data) => console.log(data, 'from isDone Change'))
      .catch((errors) => console.log(errors));
  }

  function handleModalStatus() {
    setModalStatus(!modalStatus);
    console.log(modalStatus, 'Status');
  }

  // console.log(todos,  "From App")
  return (
    <div>
      <Router>
        <Header
          isLoggedIn={state.isLoggedIn}
          Signout={signout}
          handleModalStatus={handleModalStatus}
        />

        {state.isLoggedIn ? (
          <AuthenticatedApp
            user={state.user}
            updateUser={updateUser}
            todos={todos}
            modalStatus={modalStatus}
            handleModalStatus={handleModalStatus}
            handleCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <UnAuthenticatedApp updateUser={updateUser} todos={todos} />
        )}
      </Router>
    </div>
  );
}

function AuthenticatedApp(props) {
  return (
    <Routes>
      {' '}
      <Route
        path="/"
        exact
        element={
          <Home
            todos={props.todos}
            modalStatus={props.modalStatus}
            handleModalStatus={props.handleModalStatus}
            user={props.user}
            handleCheckboxChange={props.handleCheckboxChange}
          />
        }
      ></Route>
      <Route
        path="/view/:id"
        exact
        element={<SingleTodo user={props.user} />}
      ></Route>
      <Route
        path="/edit/:id"
        exact
        element={<EditTodo user={props.user} />}
      ></Route>
    </Routes>
  );
}
function UnAuthenticatedApp(props) {
  return (
    <Routes>
      <Route path="/" exact element={<Home todos={props.todos} />}></Route>
      <Route
        path="/Signin"
        exact
        element={<Signin updateUser={props.updateUser} />}
      ></Route>
      <Route
        path="/Signup"
        exact
        element={<Signup updateUser={props.updateUser} />}
      ></Route>
    </Routes>
  );
}
export default App;
