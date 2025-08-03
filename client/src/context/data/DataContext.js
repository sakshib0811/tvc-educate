import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useHttpClient from '../../hooks/useHttpClient';
import { baseURL } from '../../utils';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sendReq, invalidateCache } = useHttpClient();

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const responseData = await sendReq(`${baseURL}/posts`);
      if (responseData && responseData.posts) {
        setPosts(responseData.posts);
      }
    } catch (err) {
      setError('Failed to fetch posts');
    }
  }, [sendReq]);

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      const responseData = await sendReq(`${baseURL}/tags`);
      if (responseData && responseData.tags) {
        setTags(responseData.tags);
      }
    } catch (err) {
      setError('Failed to fetch tags');
    }
  }, [sendReq]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchPosts(), fetchTags()]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, fetchTags]);

  // Refresh data (invalidate cache and refetch)
  const refreshData = useCallback(async () => {
    invalidateCache(`${baseURL}/posts`);
    invalidateCache(`${baseURL}/tags`);
    await fetchAllData();
  }, [invalidateCache, fetchAllData]);

  // Get approved posts
  const getApprovedPosts = useCallback(() => {
    return posts.filter(post => post.approved === true);
  }, [posts]);

  // Get posts by tag
  const getPostsByTag = useCallback((tagName) => {
    const approvedPosts = getApprovedPosts();
    return approvedPosts.filter(post =>
      post.tags.some(tag => tag.name === tagName)
    );
  }, [getApprovedPosts]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const value = {
    posts,
    tags,
    isLoading,
    error,
    fetchPosts,
    fetchTags,
    refreshData,
    getApprovedPosts,
    getPostsByTag,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 