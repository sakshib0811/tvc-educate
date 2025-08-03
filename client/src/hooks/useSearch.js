import { useContext } from 'react';
import queryString from 'query-string';
import { useHttpClient } from './useHttpClient';
import { SearchContext } from '../context/search/SearchContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { baseURL } from '../utils';

const useSearch = () => {
  const { setSearchValue, setSearchResults } = useContext(SearchContext);

  const { sendReq } = useHttpClient();
  const history = useHistory();

  const list = async (params) => {
    const query = queryString.stringify(params);
    try {
      const responseData = await sendReq(
        `${baseURL}/posts/search?${query}`
      );
      return responseData.posts;
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  };

  const search = async (value) => {
    if (value && value.trim()) {
      setSearchValue(value);
      try {
        const data = await list({ search: value.trim() });
        setSearchResults(data || []);
        history.push(`/search/?query=${encodeURIComponent(value.trim())}`);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return { search };
};

export default useSearch;
