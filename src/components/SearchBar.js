import React from 'react';
import { Search } from 'lucide-react';
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Search books by title, author, or category..."
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;