import { useState, useEffect, useCallback } from 'react';

type VisibilityHash = {
  [id: string]: string;
};

const useVisibility = () => {
  const [visibilityHash, setVisibilityHash] = useState<VisibilityHash>(() => {
    const hashString = window.localStorage.getItem('visibilityHash');
    return hashString ? JSON.parse(hashString) : {};
  });

  const isVisited = useCallback((id: string) => {
    return !!visibilityHash[id];
  }, [visibilityHash]);

  const markAsVisited = (id: string) => {
    setVisibilityHash((prevHash) => {
      return { ...prevHash, [id]: 'visited' };
    });
  };

  useEffect(() => {
    window.localStorage.setItem('visibilityHash', JSON.stringify(visibilityHash));
  }, [visibilityHash]);

  return { isVisited, markAsVisited };
};

export default useVisibility;