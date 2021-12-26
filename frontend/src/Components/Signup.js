import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
function Signup(props) {
  let [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
      name: "",
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
      passwordError = "Password must contain a character and a Number";
    }
    return passwordError;
  }

  function handleInput({ target }) {
    let { name, value } = target;
    let errors = state.errors;
    switch (name) {
      case "email":
        errors.email = validateEmail(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password = validatePassword(value);

        break;
      case "confirmPassword":
        errors.confirmPassword = validatePassword(value);
        break;
      case "name":
        errors.name =
          value.length < 3 ? "Username must be at least 3 characters" : "";
        break;
      default:
        break;
    }
    setState({ ...state, errors, [name]: value });
  }
  function handleSubmit(event) {
    event.preventDefault();
    const { name, email, password } = state;
    console.log(state, "handle submit");
    // Default options are marked with *
    fetch("http://localhost:5050/api/users/register", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Accept" : '*'
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        user: {
          name,
          email,
          password
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
        // props.updateUser(user);
        setState({ ...state, name: "", password: "", email: "" });
        console.log(user, "From Signup");
        navigate('/Signin');
      })
      .catch((errors) => {
        setState({ ...state, errors });
      });
  }

  let { email, password, name } = state.errors;
  return (
    <>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            <input
              value={state.name}
              onChange={handleInput}
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              id="name"
              name="name"
              placeholder="Name"
            />
            <span className="text-red-500 block my-2">{name}</span>
            <input
              value={state.email}
              onChange={handleInput}
              type="text"
              id="email"
              className="block border border-grey-light w-full p-3 rounded "
              name="email"
              placeholder="Email"
            />
            <span className="text-red-500 block my-2">{email}</span>
            <input
              value={state.password}
              onChange={handleInput}
              type="password"
              id="password"
              name="password"
              className="block border border-grey-light w-full p-3 rounded "
              placeholder="Password"
            />
            <span className="text-red-500 block my-2">{password}</span>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full text-center py-3 rounded bg-blue-200 text-black hover:bg-blue-400 focus:outline-none my-1"
              disabled={email || password || name}
            >
              Create Account
            </button>
            <div className="text-center text-sm text-grey-dark ">
              By signing up, you agree to the Terms of Service and Privacy
              Policy
            </div>
          </div>

          <div className="text-grey-dark mt-6">
            Already have an account?
            <Link
              to="/signin"
              className="no-underline border-b border-blue text-blue"
            >
              {" "}
              Log in
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  );
}
export default Signup;
