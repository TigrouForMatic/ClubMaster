import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const PhotoUploader = ({ onFileSelect, initialPreview = null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(initialPreview);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    validateAndProcessFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file) => {
    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées');
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleRemovePreview = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="cursor-pointer text-blue-600 hover:text-blue-500">
              <span>Télécharger un fichier</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              ou glisser-déposer ici
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Format accepté : JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="rounded-lg max-h-48 w-full object-cover"
          />
          <button
            onClick={handleRemovePreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PhotoUploader;