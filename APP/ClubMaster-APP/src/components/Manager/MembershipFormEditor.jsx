import React, { useState } from 'react';
import { Button, TextField, Switch, FileUpload } from '../ui';

const MembershipFormEditor = ({ initialData, onSave }) => {

  const [form, setForm] = useState(initialData || {
    title: '',
    description: '',
    period: '',
    requiresSignature: true,
    requiresAcknowledgment: true,
    legalText: '',
  });

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Édition de la fiche d'adhésion</h2>
      
      <TextField
        label="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      
      <TextField
        label="Période"
        placeholder="2024-2025"
        value={form.period}
        onChange={(e) => setForm({ ...form, period: e.target.value })}
      />
      
      <TextField
        label="Description"
        multiline
        rows={4}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      
      <FileUpload
        label="Logo du club"
        accept="image/*"
        onChange={(file) => {
          // Logique pour upload du logo
        }}
      />
      
      <TextField
        label="Texte légal"
        multiline
        rows={6}
        value={form.legalText}
        onChange={(e) => setForm({ ...form, legalText: e.target.value })}
      />
      
      <div className="flex items-center space-x-4">
        <Switch
          label="Signature requise"
          checked={form.requiresSignature}
          onChange={(checked) => setForm({ ...form, requiresSignature: checked })}
        />
        
        <Switch
          label="Prise de connaissance requise"
          checked={form.requiresAcknowledgment}
          onChange={(checked) => setForm({ ...form, requiresAcknowledgment: checked })}
        />
      </div>
      
      <Button onClick={() => onSave(form)}>
        Enregistrer
      </Button>
    </div>
  );
};

export default MembershipFormEditor;