import React, { useState } from 'react';
import useSearch from '../../hooks/useSearch.js';
// import SearchIcon from '@mui/icons-material/Search';

const SearchBar = (props) => {
  const { search } = useSearch();
  const [value, setValue] = useState('');
  // const [showSearch, setShowSearch] = useState(true);

  //handle input change for search bar
  const onInputChange = (evt) => {
    setValue(evt.target.value);
  };

  //handle 'enter' press event
  const onEnterKey = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      search(value);
      setValue('');
    }
  };

  return (<>
     
    <input
      className={
        props.showSearchOnMobile ? 'search-bar--mobile ' : 'search-bar '
      }
      key='random1'
      value={value}
      placeholder={'Search...'}
      onChange={onInputChange}
      onKeyDown={onEnterKey}
    />
    </>
  );
};

export default SearchBar;
