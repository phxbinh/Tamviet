/*
'use client';

import { MessageCircle } from 'lucide-react';
import { useChatbotStore } from './stores/chatbot-store';

export function ChatbotLauncher() {
  const open = useChatbotStore((s) => s.open);

  return (
    <button
      onClick={open}
      className="
        fixed bottom-6 right-6 z-[9999]
        h-16 w-16 rounded-full
        bg-black text-white
        shadow-2xl
        flex items-center justify-center
        hover:scale-105
        transition
      "
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
*/

/*
'use client';

import { MessageCircle } from 'lucide-react';
import { useChatbotStore } from '@/stores/chatbot-store';
import { useEffect, useRef, useState } from 'react';

const BUTTON_SIZE = 64;
const PADDING = 16;

export function ChatbotLauncher() {
  const open = useChatbotStore((s) => s.open);

  // vị trí hiện tại
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // drag state
  const draggingRef = useRef(false);
  const offsetRef = useRef({
    x: 0,
    y: 0,
  });

  // set vị trí mặc định khi mount
  useEffect(() => {
    setPosition({
      x: window.innerWidth - BUTTON_SIZE - 24,
      y: window.innerHeight - BUTTON_SIZE - 24,
    });
  }, []);

  // clamp trong viewport
  const clampPosition = (x: number, y: number) => {
    const maxX = window.innerWidth - BUTTON_SIZE - PADDING;
    const maxY = window.innerHeight - BUTTON_SIZE - PADDING;

    return {
      x: Math.min(Math.max(PADDING, x), maxX),
      y: Math.min(Math.max(PADDING, y), maxY),
    };
  };

  // mouse down
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = true;

    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // move
  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;

    const nextX = e.clientX - offsetRef.current.x;
    const nextY = e.clientY - offsetRef.current.y;

    setPosition(clampPosition(nextX, nextY));
  };

  // end drag
  const handlePointerUp = () => {
    draggingRef.current = false;

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  // resize viewport -> giữ button trong màn hình
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <button
      onClick={open}
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className="
        fixed left-0 top-0 z-[9999]
        h-16 w-16 rounded-full
        bg-black text-white
        shadow-2xl
        flex items-center justify-center
        hover:scale-105
        transition
        touch-none
        select-none
        cursor-grab
        active:cursor-grabbing
      "
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
*/



'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useChatbotStore } from './stores/chatbot-store';

const BUTTON_SIZE = 64;
const VIEWPORT_PADDING = 16;

export function ChatbotLauncher() {
  const open = useChatbotStore((s) => s.open);

  // vị trí button
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // tracking drag
  const draggingRef = useRef(false);

  // khoảng cách từ chuột -> góc button
  const dragOffsetRef = useRef({
    x: 0,
    y: 0,
  });

  // detect click hay drag
  const movedRef = useRef(false);

  // set default position = bottom-6 right-6
  useEffect(() => {
    setPosition({
      x: window.innerWidth - BUTTON_SIZE - 24,
      y: window.innerHeight - BUTTON_SIZE - 24,
    });
  }, []);

  // giới hạn trong viewport
  const clampPosition = (x: number, y: number) => {
    const maxX =
      window.innerWidth - BUTTON_SIZE - VIEWPORT_PADDING;

    const maxY =
      window.innerHeight - BUTTON_SIZE - VIEWPORT_PADDING;

    return {
      x: Math.min(Math.max(VIEWPORT_PADDING, x), maxX),
      y: Math.min(Math.max(VIEWPORT_PADDING, y), maxY),
    };
  };

  // bắt đầu drag
  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    draggingRef.current = true;
    movedRef.current = false;

    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    window.addEventListener(
      'pointermove',
      handlePointerMove
    );

    window.addEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  // dragging
  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;

    movedRef.current = true;

    const nextX =
      e.clientX - dragOffsetRef.current.x;

    const nextY =
      e.clientY - dragOffsetRef.current.y;

    setPosition(clampPosition(nextX, nextY));
  };

  // kết thúc drag
  const handlePointerUp = () => {
    draggingRef.current = false;

    window.removeEventListener(
      'pointermove',
      handlePointerMove
    );

    window.removeEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  // resize viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) =>
        clampPosition(prev.x, prev.y)
      );
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, []);

  // click mở chatbot
  const handleClick = () => {
    // nếu vừa drag thì không open
    if (movedRef.current) return;

    open();
  };

  return (
    <button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className="
        fixed left-0 top-0 z-[9999]

        h-16 w-16 rounded-full

        bg-black text-white

        flex items-center justify-center

        shadow-2xl

        transition-transform

        hover:scale-105

        active:scale-95

        touch-none
        select-none

        cursor-grab
        active:cursor-grabbing
      "
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}





