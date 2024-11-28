import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';


function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {   //Receive the formEvent
    event.preventDefault()
    const form = event.currentTarget;
    const data = new FormData(form); // get the data
    const toDoItem = { //create the object
      title: data.get("title") as string,
      description: data.get("description") as string
    };

    //send the data to backend
    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toDoItem),
      });

      if (response.status === 200) {
        const addedTodo = await response.json();  //apparently the .json() is asynchronus 
        setTodos((prevTodos) => [...prevTodos, addedTodo]); // Add the new item to state
      }
    } catch (e) {
      console.error('Failed to add todo:', e);
    }

    form.reset(); // Reset the form fields
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" name="title" autoFocus={true} required/>
        <input placeholder="Description" name="description" required/>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
