'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    // Fix SSR hydration issues
    immediatelyRender: false,
  });

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return (
      <div className={`rich-text-editor ${className}`}>
        <div className="border border-gray-300 rounded-t-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Carregando editor...</div>
        </div>
        <div className="border border-gray-300 rounded-b-lg p-6 min-h-[300px] bg-white shadow-sm">
          <div className="text-gray-400 text-center py-8">Carregando editor de texto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Professional Toolbar */}
      <div className="border border-gray-300 rounded-t-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                editor.isActive('bold') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Negrito (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                editor.isActive('italic') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Itálico (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                editor.isActive('underline') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Sublinhado (Ctrl+U)"
            >
              <u>U</u>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                editor.isActive('strike') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Tachado"
            >
              <s>S</s>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Headings Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                editor.isActive('heading', { level: 1 }) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Título 1"
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                editor.isActive('heading', { level: 2 }) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Título 2"
            >
              H2
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Lists Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive('bulletList') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Lista com marcadores"
            >
              •
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive('orderedList') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Lista numerada"
            >
              1.
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Text Alignment Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive({ textAlign: 'left' }) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Alinhar à esquerda"
            >
              ←
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive({ textAlign: 'center' }) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Centralizar"
            >
              ↔
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive({ textAlign: 'right' }) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Alinhar à direita"
            >
              →
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Links and Media Group */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={setLink}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive('link') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Inserir link"
            >
              🔗
            </button>
            
            {/* Image Upload */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="URL da imagem"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                onKeyPress={(e) => e.key === 'Enter' && addImage()}
              />
              <button
                onClick={addImage}
                className="px-3 py-2 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 border border-gray-300"
                title="Inserir imagem"
              >
                🖼️
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Highlight Group */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                editor.isActive('highlight') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title="Destacar texto"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-lg bg-white shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
