import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [blocks, setBlocks] = useState([
    { id: uuidv4(), position: getRandomPosition() },
  ]);

  const addBlock = (parentId) => {
    setBlocks([
      ...blocks,
      { id: uuidv4(), parentId, position: getRandomPosition() },
    ]);
  };

  const updatePosition = (id, newPosition) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, position: newPosition } : block
      )
    );
  };

  return (
    <div className="w-screen h-screen bg-pink-100 relative overflow-hidden">
      {blocks.map((block, index) => (
        <Block
          key={block.id}
          block={block}
          parent={blocks.find((b) => b.id === block.parentId)}
          onAdd={() => addBlock(block.id)}
          onDrag={(newPosition) => updatePosition(block.id, newPosition)}
          index={index + 1}
        />
      ))}
    </div>
  );
};

const Block = ({ block, parent, onAdd, onDrag, index }) => {
  const blockRef = useRef(null);
  const handleMouseDown = (e) => {
    const blockElement = blockRef.current;
    if (!blockElement) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const rect = blockElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      onDrag({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const calculateLineStart = (parent, block) => {
    const isAbove = block.position.y < parent.position.y;
    return {
      x: parent.position.x + 40,
      y: isAbove ? parent.position.y : parent.position.y + 80,
    };
  };

  const calculateLineEnd = (parent, block) => {
    const isLeft = block.position.x < parent.position.x;
    return {
      x: isLeft ? block.position.x + 80 : block.position.x,
      y: block.position.y + 40,
    };
  };

  return (
    <>
      {parent && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <polyline
            points={`
              ${calculateLineStart(parent, block).x},${calculateLineStart(parent, block).y}
              ${calculateLineStart(parent, block).x},${calculateLineEnd(parent, block).y}
              ${calculateLineEnd(parent, block).x},${calculateLineEnd(parent, block).y}
            `}
            fill="none"
            stroke="black"
            strokeDasharray="4"
          />
        </svg>
      )}
      <div
        ref={blockRef}
        className="absolute w-20 h-20 bg-pink-500 text-white flex flex-col items-center justify-center cursor-pointer shadow-lg"
        style={{ top: block.position.y, left: block.position.x }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-[-10px] text-white mt-2 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
          {index}
        </div>
        <button
          className="bg-white px-4 py-1 text-pink-500"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          +
        </button>
      </div>
    </>
  );
};

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * (window.innerWidth - 100)),
    y: Math.floor(Math.random() * (window.innerHeight - 100)),
  };
};

export default App;
