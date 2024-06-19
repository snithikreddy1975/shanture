import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks');
    setTasks(response.data);
  };

  const addTask = async (title) => {
    const response = await axios.post('http://localhost:5000/api/tasks', { title });
    setTasks([...tasks, response.data]);
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = async (id, completed) => {
    const task = tasks.find(task => task.id === id);
    const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, { ...task, completed });
    setTasks(tasks.map(task => task.id === id ? response.data : task));
  };

  const downloadPDF = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks/download', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container text-center">
      <h1>To-Do List</h1>
      <img src="https://shanture.com/wp-content/uploads/2023/10/cropped-Shanture.png" alt="Shanture Logo" style={{ width: '200px', marginBottom: '20px' }} />
      <AddTask addTask={addTask} />
      <ul className="list-group">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} />
        ))}
      </ul>
      <button className="btn btn-primary mt-3" onClick={downloadPDF}>Download Tasks as PDF</button>
    </div>
  );
};

export default TaskList;
