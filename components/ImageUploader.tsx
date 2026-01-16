import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    onUpload: (file: File) => Promise<string>;
    placeholder?: string;
    className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, onUpload, placeholder = "Image URL or Upload", className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await onUpload(file);
            onChange(url);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-gold-400 outline-none pr-10"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="secondary"
                    className="shrink-0"
                >
                    {uploading ? (
                        <span className="animate-pulse">...</span>
                    ) : (
                        <Upload size={18} />
                    )}
                </Button>
            </div>

            {/* Preview */}
            {(value || uploading) && (
                <div className="w-full h-48 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden relative group">
                    {uploading ? (
                        <div className="text-gray-400 text-sm animate-pulse">Uploading...</div>
                    ) : value ? (
                        <>
                            <img
                                src={value}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            {/* Fallback icon if image fails */}
                            <ImageIcon className="text-gray-600 absolute z-[-1]" size={32} />
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
};
