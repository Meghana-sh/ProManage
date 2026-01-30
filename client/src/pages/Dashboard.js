import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) {
      setError('Failed to load boards');
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/boards', newBoard);
      setNewBoard({ title: '', description: '' });
      setShowModal(false);
      fetchBoards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  const handleDeleteBoard = async (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await api.delete(`/boards/${id}`);
        fetchBoards();
      } catch (err) {
        setError('Failed to delete board');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Boards</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create New Board
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="boards-grid">
        {boards.map((board) => (
          <div key={board._id} className="board-card">
            <Link to={`/board/${board._id}`} className="board-card-link">
              <h3>{board.title}</h3>
              <p>{board.description || 'No description'}</p>
            </Link>
            <button
              className="btn-delete"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteBoard(board._id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Board</h2>
            <form onSubmit={handleCreateBoard}>
              <div className="form-group">
                <label>Board Title</label>
                <input
                  type="text"
                  value={newBoard.title}
                  onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={newBoard.description}
                  onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
