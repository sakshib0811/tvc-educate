import React, { useState } from 'react';
import { SearchContext } from './SearchContext';

const SearchProvider = ({ children }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    return (
        <SearchContext.Provider value={{
            searchValue,
            setSearchValue,
            searchResults,
            setSearchResults
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;