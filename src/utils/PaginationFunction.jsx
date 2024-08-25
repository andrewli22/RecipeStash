import { useState, useMemo } from 'react';

export const PaginationFunction = (data, itemsPerPage = 15) => {
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = useMemo(() => {
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    return data.slice(indexOfFirstRecord, indexOfLastRecord); 
  }, [data, currentPage, itemsPerPage])
  
  const nPages = Math.ceil(data.length / itemsPerPage);
  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    nPages
  }
}