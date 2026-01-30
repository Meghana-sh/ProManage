import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../utils/api';
import './Board.css';

const Board = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCard, setNewCard] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
      setLists(res.data.lists || []);
    } catch (err) {
      setError('Failed to load board');
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lists', { title: newListTitle, boardId: id });
      setNewListTitle('');
      setShowListModal(false);
      fetchBoard();
    } catch (err) {
      setError('Failed to create list');
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cards', { ...newCard, listId: selectedList });
      setNewCard({ title: '', description: '' });
      setShowCardModal(false);
      setSelectedList(null);
      fetchBoard();
    } catch (err) {
      setError('Failed to create card');
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Delete this list and all its cards?')) {
      try {
        await api.delete(`/lists/${listId}`);
        fetchBoard();
      } catch (err) {
        setError('Failed to delete list');
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Delete this card?')) {
      try {
        await api.delete(`/cards/${cardId}`);
        fetchBoard();
      } catch (err) {
        setError('Failed to delete card');
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      await api.put(`/cards/${draggableId}/move`, {
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index
      });
      fetchBoard();
    } catch (err) {
      setError('Failed to move card');
    }
  };

  if (!board) return <div className="loading">Loading...</div>;

  return (
    <div className="board-page">
      <div className="board-header">
        <h1>{board.title}</h1>
        <button className="btn btn-primary" onClick={() => setShowListModal(true)}>
          Add List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists-container">
          {lists.map((list) => (
            <div key={list._id} className="list">
              <div className="list-header">
                <h3>{list.title}</h3>
                <button className="btn-delete-small" onClick={() => handleDeleteList(list._id)}>
                  ×
                </button>
              </div>
              
              <Droppable droppableId={list._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`cards-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {list.cards && list.cards.map((card, index) => (
                      <Draggable key={card._id} draggableId={card._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className="card-content">
                              <h4>{card.title}</h4>
                              {card.description && <p>{card.description}</p>}
                            </div>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDeleteCard(card._id)}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                className="btn-add-card"
                onClick={() => {
                  setSelectedList(list._id);
                  setShowCardModal(true);
                }}
              >
                + Add Card
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create List Modal */}
      {showListModal && (
        <div className="modal-overlay" onClick={() => setShowListModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New List</h2>
            <form onSubmit={handleCreateList}>
              <div className="form-group">
                <label>List Title</label>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowListModal(false)}>
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

      {/* Create Card Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Card</h2>
            <form onSubmit={handleCreateCard}>
              <div className="form-group">
                <label>Card Title</label>
                <input
                  type="text"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCardModal(false)}>
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

export default Board;
