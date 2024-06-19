import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTask = ({ addTask }) => {
  const [title, setTitle] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addTask(title);
    setTitle('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Task</button>
    </form>
  );
};

export default AddTask;
