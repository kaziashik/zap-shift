import { useCallback, useMemo, useState } from 'react';

const usePagination = (items = [], pageSize = 9) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);

    const goTo = useCallback((next) => {
        setPage((prev) => {
            const safeTotal = Math.max(1, Math.ceil(items.length / pageSize));
            return Math.min(Math.max(1, next), safeTotal);
        });
    }, [items.length, pageSize]);

    const reset = useCallback(() => setPage(1), []);

    return {
        page: currentPage,
        totalPages,
        paginated,
        setPage: goTo,
        next: () => goTo(currentPage + 1),
        prev: () => goTo(currentPage - 1),
        reset
    };
};

export default usePagination;
