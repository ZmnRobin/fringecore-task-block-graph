import React, { useState } from "react";
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
          onDrag={(position) => updatePosition(block.id, position)}
          index={index + 1}
        />
      ))}
    </div>
  );
};

const Block = ({ block, parent, onAdd, onDrag, index }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - block.position.x, y: e.clientY - block.position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    onDrag({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {parent && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <polyline
            points={
              `${parent.position.x + 40},${parent.position.y + 20} ${parent.position.x + 40},${block.position.y + 20} ${block.position.x + 20},${block.position.y + 20}`
            }
            fill="none"
            stroke="black"
            strokeDasharray="4"
          />
        </svg>
      )}
      <div
        className="absolute w-20 h-20 bg-pink-500 text-white flex items-center justify-center rounded cursor-pointer shadow-lg"
        style={{ top: block.position.y, left: block.position.x }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="absolute top-1 left-1 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {index}
        </div>
        <button
          className="bg-white text-black px-4 rounded"
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
