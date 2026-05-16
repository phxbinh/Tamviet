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
const PADDING = 16;

export function ChatbotLauncher() {
  const open = useChatbotStore((s) => s.open);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // tracking drag
  const isDraggingRef = useRef(false);

  // detect moved
  const movedRef = useRef(false);

  // offset từ điểm chạm -> góc button
  const pointerOffsetRef = useRef({
    x: 0,
    y: 0,
  });

  // button element
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // init default = bottom-6 right-6
  useEffect(() => {
    setPosition({
      x: window.innerWidth - BUTTON_SIZE - 24,
      y: window.innerHeight - BUTTON_SIZE - 24,
    });
  }, []);

  // clamp viewport
  const clampPosition = (x: number, y: number) => {
    const maxX =
      window.innerWidth - BUTTON_SIZE - PADDING;

    const maxY =
      window.innerHeight - BUTTON_SIZE - PADDING;

    return {
      x: Math.min(Math.max(PADDING, x), maxX),
      y: Math.min(Math.max(PADDING, y), maxY),
    };
  };

  // pointer down
  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    const button = buttonRef.current;

    if (!button) return;

    isDraggingRef.current = true;
    movedRef.current = false;

    // lấy vị trí THỰC của button
    const rect = button.getBoundingClientRect();

    // lưu offset giữa điểm chạm và button
    pointerOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // bắt pointer
    button.setPointerCapture(e.pointerId);

    window.addEventListener(
      'pointermove',
      handlePointerMove
    );

    window.addEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  // pointer move
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDraggingRef.current) return;

    movedRef.current = true;

    const nextX =
      e.clientX - pointerOffsetRef.current.x;

    const nextY =
      e.clientY - pointerOffsetRef.current.y;

    setPosition(clampPosition(nextX, nextY));
  };

  // pointer up
  const handlePointerUp = () => {
    isDraggingRef.current = false;

    window.removeEventListener(
      'pointermove',
      handlePointerMove
    );

    window.removeEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  // resize
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

  // click open chatbot
  const handleClick = () => {
    if (movedRef.current) return;

    open();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
      className="
        fixed left-0 top-0 z-[9999]

        h-16 w-16 rounded-full

        bg-black text-white

        flex items-center justify-center

        shadow-2xl

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





