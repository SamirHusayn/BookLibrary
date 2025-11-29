import React from 'react';
import { History } from 'lucide-react';
import '../styles/History.css';

const HistoryList = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="empty-state">
        <History size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h3>No History Yet</h3>
        <p>Your library activity will appear here</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      {history.map(item => (
        <div key={item.id} className="history-item">
          <div className="history-content">
            <div>
              <strong className="history-action">{item.action}</strong>
              <span className="history-book">"{item.bookTitle}"</span>
            </div>
            <span className="history-time">
              {new Date(item.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;