import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signin(props) {
  let [state, setState] = useState({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validatePassword(password) {
    let passwordError;
    if (password.length < 7) {
      passwordError = "Password can't be less than 6 characters";
    }
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
    if (!re.test(password)) {
      passwordError = 'Password must contain a character and a Number';
    }
    return passwordError;
  }

  function handleInput({ target }) {
    let { name, value } = target;
    let errors = state.errors;
    switch (name) {
      case 'email':
        errors.email = validateEmail(value) ? '' : 'Email is not valid!';
        break;
      case 'password':
        errors.password = validatePassword(value);
        break;
      default:
        break;
    }
    setState({ ...state, errors, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = state;
    // Default options are marked with *
    fetch('http://localhost:5050/api/users/login', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        user: {
          email,
          password,
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
      .then(({ user }) => {
        console.log(user);
        props.updateUser(user);
        navigate('/');
      })
      .catch((errors) => {
        console.log(errors, "Err");
        setState((prevState) => {
          return {
            ...prevState,
            errors: {
              ...prevState.errors,
              email: 'Email or Password is incorrect!',
            },
          };
        });
      });
  }

  let { email, password } = state.errors;
  return (
    <>
      <section className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form className="px-5 py-7">
              <h2 className="font-bold text-center text-2xl mb-5">Sign In</h2>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                E-mail
              </label>
              <input
                value={state.email}
                onChange={handleInput}
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <span className="text-red-500 block my-2">{email}</span>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                value={state.password}
                onChange={handleInput}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <span className="text-red-500 block my-2">{password}</span>
              <button
                type="button"
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                onClick={handleSubmit}
              >
                <span className="inline-block mr-2">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </form>
            {state.isLoggedIn ? <p>user loggedin</p> : ''}
          </div>
          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 inline-block align-text-top"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <Link className="inline-block ml-1 border py-1 px-3 " to="/">
                    {' '}
                    Back to Home
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Signin;
