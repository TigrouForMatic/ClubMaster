import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import api from '../js/App/Api';
// import useStore from '../../store/store';

const PhotoUploader = ({ referenceId, referenceType }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    
    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (!file) return;
        
        await uploadFile(file);
    };
    
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        await uploadFile(file);
    };
    
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('referenceid', referenceId);
        formData.append('referencetype', referenceType);
        
        try {
            const response = await api.post('/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // response.data.url = response.data.url.replace('\\', '/');
            console.log(response.data);
            console.log(file);
            setPreview(URL.createObjectURL(file));
        } catch (error) {
            setError('Erreur lors de l\'upload de la photo');
            console.error(error);
        }
    };

    return (
        <div className="space-y-4">
            <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
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
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {preview && (
                <div className="relative">
                    <img 
                        src={preview} 
                        alt="Aperçu" 
                        className="rounded-lg max-h-48 w-auto"
                    />
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhotoUploader;