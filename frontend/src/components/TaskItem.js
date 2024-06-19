import React from 'react';

const TaskItem = ({ task, deleteTask, toggleTask }) => {
  return (
    <li className={`m-auto mt-3 list-group-item ${task.completed ? 'list-group-item-success' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id, !task.completed)}
      />
      {task.title}
      <button className="btn btn-danger btn-sm float-right mr-2" onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
