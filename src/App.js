import React, { useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

// Common Constants
const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};
// Wtf is this?
const FILTER_NAMES = Object.keys(FILTER_MAP);


// Local Storage Object
let lh={
  set:(tasks)=>{localStorage.setItem("todo", JSON.stringify(tasks))},
  get:JSON.parse(localStorage.getItem("todo"))
}
if (lh.get == null) {
  lh.get = []
}
navigator.storage.persist()
function App(props) {
  console.log(lh.get)
  const [tasks, setTasks] = useState(lh.get);
  const [filter, setFilter] = useState('All');
  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    lh.set([...tasks, newTask]);
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);  
    lh.set(updatedTasks);
  }
  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
    lh.set(remainingTasks);
  }
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    lh.set(editedTaskList);
    setTasks(editedTaskList);
  }
  console.log(props.tasks);
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  return (
    <div className="todoapp stack-large">
      <h1>To-Do List</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
      {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
