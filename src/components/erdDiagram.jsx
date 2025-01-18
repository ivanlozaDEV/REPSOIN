import React from 'react';

export default function ERDiagram() {
  return (
    <div className="flex justify-center">
      
      <svg width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
          </marker>
        </defs>
        
        {/* Category */}
        <rect x="50" y="50" width="150" height="100" fill="#e6f2ff" stroke="#000" />
        <text x="125" y="85" textAnchor="middle" fill="#000">Category</text>
        <text x="60" y="110" fill="#000">id</text>
        <text x="60" y="130" fill="#000">name</text>

        {/* Subcategory */}
        <rect x="300" y="50" width="150" height="100" fill="#fff2e6" stroke="#000" />
        <text x="375" y="85" textAnchor="middle" fill="#000">Subcategory</text>
        <text x="310" y="110" fill="#000">id</text>
        <text x="310" y="130" fill="#000">name</text>
        <text x="310" y="150" fill="#000">category_id</text>

        {/* Product */}
        <rect x="300" y="250" width="150" height="120" fill="#e6ffe6" stroke="#000" />
        <text x="375" y="285" textAnchor="middle" fill="#000">Product</text>
        <text x="310" y="310" fill="#000">id</text>
        <text x="310" y="330" fill="#000">name</text>
        <text x="310" y="350" fill="#000">description</text>
        <text x="310" y="370" fill="#000">price</text>
        <text x="310" y="390" fill="#000">stock</text>
        <text x="310" y="410" fill="#000">subcategory_id</text>

        {/* Relationships */}
        <line x1="200" y1="100" x2="300" y2="100" stroke="#000" markerEnd="url(#arrow)" />
        <text x="250" y="90" textAnchor="middle" fill="#000">1:N</text>

        <line x1="375" y1="150" x2="375" y2="250" stroke="#000" markerEnd="url(#arrow)" />
        <text x="385" y="200" textAnchor="start" fill="#000">1:N</text>
      </svg>
    </div>
  );
}

