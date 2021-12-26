import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewTodo from './NewTodo';

function Home(props) {
  // let todos = props.todos;
  let user = props.user;
  const [todos, setTodos] =  useState(props.todos);
  const [sortBy, setSortBy] = useState("normal");

  useEffect (() => {
    let newArr = []
    if(todos && todos.length !==0) {
    switch (sortBy) {
      case "sortByDate":
       newArr = todos.sort(function(a,b){
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        // console.log(newArr, "new Arr");
        setTodos(newArr);
        break;
        case "sortByTitle" : 
        newArr = todos.sort(function (a, b) {
          return a.title - b.title 
        })
        // console.log(newArr, "new Arr title");
        setTodos(newArr);
        break;        
      default:
        newArr = [];
        setTodos(todos);
        break;
    }
  }
  }, [sortBy, todos])

  
  console.log(todos, "from home");
  console.log(sortBy, "sortBy from home");

  return (
    <div className="flex flex-col justify-center items-center m-10 border-2 p-10">
      {todos && (
        <div className="w-full flex justify-end mb-10">
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option name="normal" value={"normal"}>Normal</option>
            <option name="sortByDate" value={"sortByDate"}>Sort by Date Created</option>
            <option name="sortByTitle" value={"sortByTitle"}>Sort by Title</option>
          </select>
        </div>
      )}
      {user && (
        <button
        className="block font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 hover:underline mr-5"
        onClick={props.handleModalStatus}
      >
        Add Todo
      </button>
      )}
      {todos &&
        todos.map((todo) => {
          return (
            <div
              key={todo._id}
              className="flex items-center border-2 w-1/3 mb-10 p-5 justify-between"
            >
              <h1>{todo.title}</h1>
              {user && (
                <>
                  <input
                    type="checkbox"
                    name={todo._id}
                    checked={todo.isDone}
                    onChange={() => props.handleCheckboxChange(todo._id)}
                  />
                  <Link
                    exact="true"
                    to={`/view/${todo._id}`}
                    className="block font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 hover:underline"
                  >
                    View
                  </Link>
                </>
              )}
            </div>
          );
        })}
      {props.modalStatus && (
        <div className='w-2/3 absolute left-auto right-auto z-10 top-15 bg-green-200 p-10'>
          <NewTodo handleModalStatus={props.handleModalStatus}/>
        </div>
      )}
      {!user && (
        <div>
        <p>Please Signup/Login to Explore all The Features!</p>
        </div>
      )}

    </div> 
  );
}

export default Home;
