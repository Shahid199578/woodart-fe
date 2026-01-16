import React, { useState } from 'react';
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet'
    ];

    return (
        <div className={`bg-white/5 border border-white/10 rounded-sm overflow-hidden text-white ${className}`}>
            <style>{`
                .ql-toolbar { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; background: rgba(0,0,0,0.2) }
                .ql-container { border: none !important; font-size: 1rem; color: #e5e5e5; }
                .ql-editor { min-height: 200px; }
                .ql-snow .ql-stroke { stroke: #9ca3af !important; }
                .ql-snow .ql-fill { fill: #9ca3af !important; }
                .ql-snow .ql-picker { color: #9ca3af !important; }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
};
