'use client';

import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = ''
}) => {
  return (
    <div 
      className={`rich-text-content prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;

