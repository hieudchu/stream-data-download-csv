import { useState, useEffect } from 'react';
import { User } from '../types/user';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UsersResponse {
  data: User[];
  pagination: PaginationData;
}

export const useUsers = (initialPage: number = 1) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?page=${pageNumber}&limit=10`);
      const data: UsersResponse = await response.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return {
    users,
    page,
    setPage,
    totalPages,
    loading
  };
};