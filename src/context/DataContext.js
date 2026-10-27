
import { createContext, useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const {
    data,
    fetchError,
    isLoading
  } = useAxiosFetch('http://localhost:3500/posts');

  useEffect(() => {
    if (Array.isArray(data)) {
      setPosts(data);
    }
  }, [data]);

  useEffect(() => {
    const query = search.toLowerCase().trim();

    const filteredResults = posts.filter((post) => {
      const title = (post.title || '').toLowerCase();
      const body = (post.body || '').toLowerCase();

      return title.includes(query) || body.includes(query);
    });

    setSearchResults([...filteredResults].reverse());
  }, [posts, search]);

  return (
    <DataContext.Provider
      value={{
        search,
        setSearch,
        searchResults,
        fetchError,
        isLoading,
        posts,
        setPosts
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;