/**
 * Board Page
 * Displays Kanban board with tasks
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BoardWithTasks } from '@/types';
import BoardView from '@/components/board/BoardView';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  
  const [board, setBoard] = useState<BoardWithTasks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      const data = await response.json();

      if (data.success) {
        setBoard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!board) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Board not found</Typography>
      </Box>
    );
  }

  return <BoardView board={board} onTaskUpdate={fetchBoard} />;
}
