import { useCallback, useEffect, useMemo, useState } from "react";

const useClientPagination = (items = [], pageSize = 10) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    setVisibleCount((current) => Math.min(current + pageSize, items.length));
  }, [items.length, pageSize]);

  return { visibleItems, hasMore, loadMore };
};

export default useClientPagination;
