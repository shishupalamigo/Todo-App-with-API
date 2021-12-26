import React, { useState } from 'react';

function NewTodo(props) {
  // console.log(props, "New Todo");
  const [state, setState] = useState({
    title: '',
    description: '',
  });

  function handleInput({ target }) {
    let { name, value } = target;
    let errors = state.errors;
    setState({ ...state, errors, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let storageKey = localStorage['app__user'];
    const { title, description } = state;
    console.log(state, 'handle submit');
    // Default options are marked with *
    fetch('http://localhost:5050/api/todo', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        Accept: '*',
        authorization: `${storageKey}`,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        todo: {
          title,
          description,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        } else {
          return res.json();
        }
      })
      .then(({ todo }) => {
        // props.updateUser(user);
        setState({ ...state, title: '', description: '' });
        console.log(todo, 'From New Todo');
        props.handleModalStatus();
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  // let { description, isDone, title } = state.errors;
  return (
    <>
      <div className="bg-grey-lighter flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <button onClick={props.handleModalStatus} className='text-red-500 absolute right-5 top-5 z-20'>X Close</button>
            <h1 className="mb-8 text-3xl text-center">New Todo</h1>
            <input
              value={state.title}
              onChange={handleInput}
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              id="title"
              name="title"
              placeholder="Title"
            />
            <textarea
              onChange={handleInput}
              type="text"
              id="description"
              className="block border border-grey-light w-full p-3 rounded "
              name="description"
              placeholder="Description"
              defaultValue={state.description}
            >
            </textarea>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full text-center py-3 rounded bg-blue-200 text-black hover:bg-blue-400 focus:outline-none my-1"
            >
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewTodo;
