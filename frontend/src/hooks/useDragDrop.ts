import { useState, useCallback, DragEvent } from 'react';

interface UseDragDropOptions {
  onTextDrop: (text: string) => void;
}

export function useDragDrop({ onTextDrop }: UseDragDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('text/plain')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      const text = e.dataTransfer.getData('text/plain');

      // 1. Handle text files
      if (files && files.length > 0) {
        const file = files[0];
        
        // Only accept text files (or similar text based formats) for MVP
        if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.txt')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
              onTextDrop(event.target.result);
            }
          };
          reader.readAsText(file);
        }
        return;
      }

      // 2. Handle text drag & drop directly
      if (text) {
        onTextDrop(text);
      }
    },
    [onTextDrop]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}
