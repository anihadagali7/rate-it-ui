import { useEffect, useRef } from "react";

const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading }) => {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "400px", threshold: 0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return loadMoreRef;
};

export default useInfiniteScroll;
