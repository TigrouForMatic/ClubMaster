import React, { useState, useEffect } from 'react';
import PhotoUploader from '../PhotoUploader';
import api from '../../js/App/Api';
import useStore from '../../store/store';

const MembershipFormEditor = ({ club, initialData = null, onClose }) => {
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);

  const [membershipForm, setMembershipForm] = useState({
    title: '',
    description: '',
    period: '',
    requiresSignature: true,
    requiresAcknowledgment: true,
    legalText: '',
  });

  useEffect(() => {
      setMembershipForm({
          title: initialData?.title || '',
          description: initialData?.description || '',
          period: initialData?.period || '',
          requiresSignature: initialData?.requiresSignature || true,
          requiresAcknowledgment: initialData?.requiresAcknowledgment || true,
          legalText: initialData?.legalText || '',
      });
  }, [initialData]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleClose = () => {
    setMembershipForm({
      title: '',
      description: '',
      period: '',
      requiresSignature: true,
      requiresAcknowledgment: true,
      legalText: '',
    });
    setFile(null);
    setPreview(null);
    onClose();
  };

  const handlePhotoChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMembershipForm(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      membershipForm.clubid = club.id;
      let response;
      if (initialData) {
        response = await api.put(`/membershipForm/${membershipForm.id}`, membershipForm);
        updateItem('membershipForms', response);
        await uploadFile(membershipForm.id);
      } else {
        response = await api.post('/membershipForm', membershipForm);
        addItem('membershipForms', response);
        await uploadFile(response.id);
      }
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification de la fiche d\'adhésion:', error);
    }
  };

  const uploadFile = async (referenceId) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('referenceid', referenceId);
    formData.append('referencetype', 'membershipForm');
    formData.append('clubid', selectedClubId);
    
    try {
      const response = await api.post('/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      });
      
      addItem('photos', response);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Édition de la fiche d'adhésion
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <div className="flex items-center space-x-6">
                <div className="w-50 h-50">
                    <PhotoUploader
                        label="Logo du club"
                        accept="image/*"
                        onFileSelect={handlePhotoChange}
                        initialPreview={preview}
                    />
                    {preview && (
                        <div className="mt-2">
                            <img 
                                src={preview} 
                                alt="Aperçu du logo" 
                                className="w-full rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
                
                <h1 className="text-3xl font-bold flex-grow">
                    {club.label}
                </h1>

                <div className="w-48">
                    <label className="text-sm font-medium text-zinc-700">Période</label>
                    <input
                        type="text"
                        name="period"
                        placeholder="2024-2025"
                        value={membershipForm.period}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Titre</label>
            <input
              type="text"
              name="title"
              value={membershipForm.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <textarea
              name="description"
              value={membershipForm.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Texte légal</label>
            <textarea
              name="legalText"
              value={membershipForm.legalText}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between space-x-4 pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresSignature"
                checked={membershipForm.requiresSignature}
                onChange={(e) => setMembershipForm({ ...membershipForm, requiresSignature: e.target.checked })}
                className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="requiresSignature" className="text-sm font-medium text-zinc-700">
                Signature requise
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresAcknowledgment"
                checked={membershipForm.requiresAcknowledgment}
                onChange={(e) => setMembershipForm({ ...membershipForm, requiresAcknowledgment: e.target.checked })}
                className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="requiresAcknowledgment" className="text-sm font-medium text-zinc-700">
                Prise de connaissance requise
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
            >
                Annuler
            </button>
            <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            >
                { membershipForm ? 'Modifier' : 'Créer'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default MembershipFormEditor;