import React, { useState, useRef, useMemo } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Upload, Check, X, Loader2, AlertCircle, Search, Layers, TestTube } from 'lucide-react';
import { LabExam, LabProfile, EXAM_CATEGORIES } from '../data';
import { extractPricesFromImage } from '../services/geminiService';
import Fuse from 'fuse.js';

interface AdminViewProps {
  labExams: LabExam[];
  setLabExams: React.Dispatch<React.SetStateAction<LabExam[]>>;
  labProfiles: LabProfile[];
  setLabProfiles: React.Dispatch<React.SetStateAction<LabProfile[]>>;
  lastUpdated: string;
  setLastUpdated: React.Dispatch<React.SetStateAction<string>>;
  onNavigateBack: () => void;
}

interface ProposedChange {
  examId: string;
  name: string;
  oldPrice: number;
  newPrice: number;
}

export default function AdminView({ 
  labExams, setLabExams, 
  labProfiles, setLabProfiles, 
  lastUpdated, setLastUpdated, 
  onNavigateBack 
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'exams' | 'profiles'>('exams');
  
  // Exams State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<LabExam | null>(null);
  const [examFormData, setExamFormData] = useState({ id: '', name: '', price: '', aliases: '', category: '' });
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  
  // Sorting and Bulk Actions State
  const [sortConfig, setSortConfig] = useState<{ key: keyof LabExam; direction: 'asc' | 'desc' } | null>(null);
  const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  
  // Profiles State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<LabProfile | null>(null);
  const [profileFormData, setProfileFormData] = useState({ name: '', aliases: '', specialPrice: '' });
  const [selectedProfileExams, setSelectedProfileExams] = useState<Set<string>>(new Set());
  const [profileSearchQuery, setProfileSearchQuery] = useState('');

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'exam' | 'profile', id: string, name: string } | null>(null);

  // OCR State
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposedChanges, setProposedChanges] = useState<ProposedChange[]>([]);
  const [proposedDate, setProposedDate] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EXAMS LOGIC ---
  const handleOpenAddExam = () => {
    setEditingExam(null);
    setExamFormData({ id: '', name: '', price: '', aliases: '', category: '' });
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: LabExam) => {
    setEditingExam(exam);
    setExamFormData({
      id: exam.id,
      name: exam.name,
      price: exam.price.toString(),
      aliases: exam.aliases,
      category: exam.category || ''
    });
    setIsExamModalOpen(true);
  };

  const confirmDeleteExam = (exam: LabExam) => {
    setDeleteConfirm({ type: 'exam', id: exam.id, name: exam.name });
  };

  const confirmDeleteProfile = (profile: LabProfile) => {
    setDeleteConfirm({ type: 'profile', id: profile.id, name: profile.name });
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'exam') {
      setLabExams(prev => prev.filter(e => e.id !== deleteConfirm.id));
      setLabProfiles(prev => prev.map(p => ({
        ...p,
        examIds: p.examIds.filter(eId => eId !== deleteConfirm.id)
      })));
    } else {
      setLabProfiles(prev => prev.filter(p => p.id !== deleteConfirm.id));
    }
    
    setDeleteConfirm(null);
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(examFormData.price);
    if (isNaN(price)) return;

    const generateId = () => {
      if (labExams.length === 0) return '1';
      
      const maxNum = labExams.reduce((max, ex) => {
        const num = parseInt(ex.id, 10);
        return !isNaN(num) && num > max ? num : max;
      }, 0);
      
      return (maxNum + 1).toString();
    };

    if (editingExam) {
      const newId = examFormData.id.trim() || editingExam.id;
      
      setLabExams(prev => prev.map(exam => 
        exam.id === editingExam.id 
          ? { ...exam, id: newId, name: examFormData.name, price, aliases: examFormData.aliases, category: examFormData.category }
          : exam
      ));
      
      if (newId !== editingExam.id) {
        setLabProfiles(prev => prev.map(p => ({
          ...p,
          examIds: p.examIds.map(eId => eId === editingExam.id ? newId : eId)
        })));
      }
    } else {
      const newExam: LabExam = {
        id: examFormData.id.trim() || generateId(),
        name: examFormData.name,
        price,
        aliases: examFormData.aliases,
        category: examFormData.category
      };
      setLabExams(prev => [...prev, newExam]);
    }

    setEditingExam(null);
    setExamFormData({ id: '', name: '', price: '', aliases: '', category: '' });
    setIsExamModalOpen(false);
  };

  const handleCancelExam = () => {
    setEditingExam(null);
    setExamFormData({ id: '', name: '', price: '', aliases: '', category: '' });
    setIsExamModalOpen(false);
  };

  const handleSort = (key: keyof LabExam) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleExamSelection = (id: string) => {
    setSelectedExams(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllExams = () => {
    if (selectedExams.size === filteredExams.length) {
      setSelectedExams(new Set());
    } else {
      setSelectedExams(new Set(filteredExams.map(e => e.id)));
    }
  };

  const handleBulkEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLabExams(prev => prev.map(exam => 
      selectedExams.has(exam.id) ? { ...exam, category: bulkCategory } : exam
    ));
    setIsBulkEditModalOpen(false);
    setSelectedExams(new Set());
    setBulkCategory('');
  };

  const handleCreateProfileFromSelection = () => {
    setEditingProfile(null);
    setProfileFormData({ name: '', aliases: '', specialPrice: '' });
    setSelectedProfileExams(new Set(selectedExams));
    setActiveTab('profiles');
    setIsProfileModalOpen(true);
    setSelectedExams(new Set());
  };

  // --- PROFILES LOGIC ---
  const handleOpenAddProfile = () => {
    setEditingProfile(null);
    setProfileFormData({ name: '', aliases: '', specialPrice: '' });
    setSelectedProfileExams(new Set());
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = (profile: LabProfile) => {
    setEditingProfile(profile);
    setProfileFormData({
      name: profile.name,
      aliases: profile.aliases,
      specialPrice: profile.specialPrice.toString()
    });
    setSelectedProfileExams(new Set(profile.examIds));
    setIsProfileModalOpen(true);
  };

  const getProfileRealTotal = (examIds: Set<string>) => {
    return Array.from(examIds).reduce((sum, id) => {
      const exam = labExams.find(e => e.id === id);
      return sum + (exam ? exam.price : 0);
    }, 0);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProfileExams.size === 0) {
      alert("Debes seleccionar al menos un examen para el perfil.");
      return;
    }

    let specialPrice = parseFloat(profileFormData.specialPrice);
    if (isNaN(specialPrice)) {
      specialPrice = getProfileRealTotal(selectedProfileExams);
    }

    if (editingProfile) {
      setLabProfiles(prev => prev.map(profile => 
        profile.id === editingProfile.id 
          ? { 
              ...profile, 
              name: profileFormData.name, 
              aliases: profileFormData.aliases,
              examIds: Array.from(selectedProfileExams),
              specialPrice
            }
          : profile
      ));
    } else {
      const newProfile: LabProfile = {
        id: 'p' + Date.now().toString(),
        name: profileFormData.name,
        aliases: profileFormData.aliases,
        examIds: Array.from(selectedProfileExams),
        specialPrice
      };
      setLabProfiles(prev => [...prev, newProfile]);
    }

    setEditingProfile(null);
    setProfileFormData({ name: '', aliases: '', specialPrice: '' });
    setSelectedProfileExams(new Set());
    setIsProfileModalOpen(false);
  };

  const handleCancelProfile = () => {
    setEditingProfile(null);
    setProfileFormData({ name: '', aliases: '', specialPrice: '' });
    setSelectedProfileExams(new Set());
    setIsProfileModalOpen(false);
  };

  const toggleProfileExam = (id: string) => {
    setSelectedProfileExams(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- OCR LOGIC ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setOcrError(null);
    setProposedChanges([]);
    setProposedDate(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const result = await extractPricesFromImage(base64String, file.type);
          
          if (result.date) {
            setProposedDate(result.date);
          }

          const fuse = new Fuse(labExams, {
            keys: ['name', 'aliases'],
            threshold: 0.2,
            includeScore: true
          });

          const changes: ProposedChange[] = [];
          
          result.exams.forEach(extracted => {
            const matches = fuse.search(extracted.name);
            if (matches.length > 0) {
              const bestMatch = matches[0].item;
              if (bestMatch.price !== extracted.price) {
                changes.push({
                  examId: bestMatch.id,
                  name: bestMatch.name,
                  oldPrice: bestMatch.price,
                  newPrice: extracted.price
                });
              }
            }
          });

          setProposedChanges(changes);
          if (changes.length === 0) {
            setOcrError("No se encontraron cambios de precios o no se pudo hacer coincidir los nombres.");
          }
        } catch (err: any) {
          setOcrError(err.message || "Error procesando la imagen.");
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsProcessing(false);
      setOcrError("Error leyendo el archivo.");
    }
  };

  const applyProposedChanges = () => {
    setLabExams(prev => {
      const newExams = [...prev];
      proposedChanges.forEach(change => {
        const index = newExams.findIndex(e => e.id === change.examId);
        if (index !== -1) {
          newExams[index] = { ...newExams[index], price: change.newPrice };
        }
      });
      return newExams;
    });

    if (proposedDate) {
      setLastUpdated(proposedDate);
    }

    setProposedChanges([]);
    setProposedDate(null);
    alert("¡Precios actualizados con éxito!");
  };

  const cancelProposedChanges = () => {
    setProposedChanges([]);
    setProposedDate(null);
    setOcrError(null);
  };

  // --- FILTERING ---
  const filteredExams = useMemo(() => {
    let result = labExams;

    if (adminSearchQuery.trim()) {
      const fuse = new Fuse(labExams, {
        keys: [
          { name: 'normalizedName', getFn: (exam) => exam.name.replace(/\./g, '') },
          { name: 'normalizedAliases', getFn: (exam) => exam.aliases.replace(/\./g, '') },
          'name',
          'aliases'
        ],
        threshold: 0.2,
        ignoreLocation: true,
        includeScore: true,
      });

      const cleanQuery = adminSearchQuery.replace(/\./g, '');
      result = fuse.search(cleanQuery).map(res => res.item);
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'id') {
          aValue = parseInt(a.id, 10);
          bValue = parseInt(b.id, 10);
        }

        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [adminSearchQuery, labExams, sortConfig]);

  const filteredExamsForProfile = useMemo(() => {
    if (!profileSearchQuery.trim()) return labExams;
    
    const fuse = new Fuse(labExams, {
      keys: [
        { name: 'normalizedName', getFn: (exam) => exam.name.replace(/\./g, '') },
        { name: 'normalizedAliases', getFn: (exam) => exam.aliases.replace(/\./g, '') },
        'name',
        'aliases'
      ],
      threshold: 0.2,
      ignoreLocation: true,
      includeScore: true,
    });

    const cleanQuery = profileSearchQuery.replace(/\./g, '');
    return fuse.search(cleanQuery).map(result => result.item);
  }, [profileSearchQuery, labExams]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onNavigateBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Administración</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('exams')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'exams' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <TestTube className="w-5 h-5" />
            Exámenes Individuales
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'profiles' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-5 h-5" />
            Perfiles (Grupos)
          </button>
        </div>

        {activeTab === 'exams' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column: OCR */}
            <div className="space-y-6">
              {/* OCR Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Actualización Automática (IA)</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Sube una foto de una lista de precios. La IA extraerá los precios y actualizará los exámenes existentes.
                </p>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full border-2 border-dashed border-blue-300 bg-blue-50 text-blue-700 py-4 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Procesando imagen...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      <span>Subir Imagen de Precios</span>
                    </>
                  )}
                </button>

                {ocrError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{ocrError}</p>
                  </div>
                )}

                {proposedChanges.length > 0 && (
                  <div className="mt-6 border border-amber-200 rounded-lg overflow-hidden">
                    <div className="bg-amber-50 p-3 border-b border-amber-200">
                      <h3 className="font-medium text-amber-900">Cambios Propuestos</h3>
                      {proposedDate && (
                        <p className="text-sm text-amber-700">Nueva fecha: {proposedDate}</p>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto bg-white p-0">
                      <ul className="divide-y divide-slate-100">
                        {proposedChanges.map((change, i) => (
                          <li key={i} className="p-3 text-sm flex justify-between items-center">
                            <span className="font-medium truncate pr-2">{change.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-400 line-through">{change.oldPrice}</span>
                              <ArrowLeft className="w-3 h-3 rotate-180 text-blue-500" />
                              <span className="font-bold text-green-600">{change.newPrice}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                      <button 
                        onClick={applyProposedChanges}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Aplicar
                      </button>
                      <button 
                        onClick={cancelProposedChanges}
                        className="flex-1 bg-slate-200 text-slate-800 py-1.5 rounded hover:bg-slate-300 transition-colors text-sm font-medium"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: List of Exams */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[800px]">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                  <h2 className="font-semibold text-slate-800">Base de Datos de Exámenes ({labExams.length})</h2>
                  <span className="text-xs text-slate-500">Actualizado: {lastUpdated}</span>
                </div>
                <button
                  onClick={handleOpenAddExam}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Examen
                </button>
              </div>
              
              <div className="p-4 border-b border-slate-200 bg-white space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                    placeholder="Buscar examen para editar..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                  />
                </div>
                {selectedExams.size > 0 && (
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium text-blue-800 px-2">
                      {selectedExams.size} seleccionado{selectedExams.size !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setIsBulkEditModalOpen(true)}
                      className="bg-white hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-sm font-medium border border-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar Categoría
                    </button>
                    {selectedExams.size >= 5 && (
                      <button
                        onClick={handleCreateProfileFromSelection}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Crear Perfil
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="p-4 border-b w-12">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedExams.size > 0 && selectedExams.size === filteredExams.length}
                          ref={input => {
                            if (input) {
                              input.indeterminate = selectedExams.size > 0 && selectedExams.size < filteredExams.length;
                            }
                          }}
                          onChange={toggleAllExams}
                        />
                      </th>
                      <th 
                        className="p-4 font-medium text-slate-500 border-b cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center gap-1">
                          ID
                          {sortConfig?.key === 'id' && (
                            <span className="text-blue-500 text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="p-4 font-medium text-slate-500 border-b cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Nombre
                          {sortConfig?.key === 'name' && (
                            <span className="text-blue-500 text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="p-4 font-medium text-slate-500 border-b cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-1">
                          Categoría
                          {sortConfig?.key === 'category' && (
                            <span className="text-blue-500 text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="p-4 font-medium text-slate-500 border-b cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center gap-1">
                          Precio (REF)
                          {sortConfig?.key === 'price' && (
                            <span className="text-blue-500 text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                      <th className="p-4 font-medium text-slate-500 border-b text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No se encontraron exámenes para "{adminSearchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredExams.map(exam => (
                        <tr key={exam.id} className={`hover:bg-slate-50 transition-colors ${selectedExams.has(exam.id) ? 'bg-blue-50/50' : ''}`}>
                          <td className="p-4">
                            <input 
                              type="checkbox" 
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={selectedExams.has(exam.id)}
                              onChange={() => toggleExamSelection(exam.id)}
                            />
                          </td>
                          <td className="p-4 text-sm text-slate-500 font-mono">
                            {exam.id}
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-900">{exam.name}</div>
                            {exam.aliases && <div className="text-xs text-slate-500 truncate max-w-xs">{exam.aliases}</div>}
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {exam.category ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                {EXAM_CATEGORIES.find(c => c.id === exam.category)?.name || exam.category}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs italic">-</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-slate-700">
                            {exam.price.toFixed(2)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditExam(exam)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => confirmDeleteExam(exam)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 gap-8">
            {/* List of Profiles */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[800px]">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <h2 className="font-semibold text-slate-800">Perfiles Creados ({labProfiles.length})</h2>
                <button
                  onClick={handleOpenAddProfile}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear Perfil
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 shadow-sm">
                    <tr>
                      <th className="p-4 font-medium text-slate-500 border-b">Nombre del Perfil</th>
                      <th className="p-4 font-medium text-slate-500 border-b">Exámenes</th>
                      <th className="p-4 font-medium text-slate-500 border-b">Precio</th>
                      <th className="p-4 font-medium text-slate-500 border-b text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          No hay perfiles creados.
                        </td>
                      </tr>
                    ) : (
                      labProfiles.map(profile => {
                        const realTotal = getProfileRealTotal(new Set(profile.examIds));
                        return (
                          <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-slate-900 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-purple-500" />
                                {profile.name}
                              </div>
                              {profile.aliases && <div className="text-xs text-slate-500 truncate max-w-xs">{profile.aliases}</div>}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-purple-100 bg-purple-600 rounded-full">
                                {profile.examIds.length}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                {realTotal > profile.specialPrice && (
                                  <span className="text-xs text-slate-400 line-through">
                                    {realTotal.toFixed(2)}
                                  </span>
                                )}
                                <span className="font-semibold text-purple-700">
                                  {profile.specialPrice.toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEditProfile(profile)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => confirmDeleteProfile(profile)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingExam ? 'Editar Examen' : 'Agregar Nuevo Examen'}
              </h2>
              <button onClick={handleCancelExam} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select
                  required
                  value={examFormData.category}
                  onChange={e => setExamFormData({...examFormData, category: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Seleccione una categoría</option>
                  {EXAM_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  required
                  type="text"
                  value={examFormData.name}
                  onChange={e => setExamFormData({...examFormData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio (REF)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={examFormData.price}
                  onChange={e => setExamFormData({...examFormData, price: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Aliases (separados por coma)</label>
                <input
                  type="text"
                  value={examFormData.aliases}
                  onChange={e => setExamFormData({...examFormData, aliases: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancelExam}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 font-medium"
                >
                  {editingExam ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingExam ? 'Guardar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingProfile ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
              </h2>
              <button onClick={handleCancelProfile} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitProfile} className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Perfil</label>
                <input
                  required
                  type="text"
                  value={profileFormData.name}
                  onChange={e => setProfileFormData({...profileFormData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Aliases (separados por coma)</label>
                <input
                  type="text"
                  value={profileFormData.aliases}
                  onChange={e => setProfileFormData({...profileFormData, aliases: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">Exámenes Incluidos</label>
                  <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                    {selectedProfileExams.size}
                  </span>
                </div>
                
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Search className="h-3 w-3 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded text-xs bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Buscar para agregar..."
                    value={profileSearchQuery}
                    onChange={(e) => setProfileSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded bg-white">
                  {filteredExamsForProfile.map(exam => (
                    <label key={exam.id} className="flex items-center p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0">
                      <input 
                        type="checkbox" 
                        className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                        checked={selectedProfileExams.has(exam.id)}
                        onChange={() => toggleProfileExam(exam.id)}
                      />
                      <span className="text-xs flex-1">{exam.name}</span>
                      <span className="text-xs text-slate-500">{exam.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-900">Total Real (Suma):</span>
                  <span className="text-sm font-bold text-purple-700">{getProfileRealTotal(selectedProfileExams).toFixed(2)} REF</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-1">Precio Especial (REF)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Dejar vacío para usar el Total Real"
                    value={profileFormData.specialPrice}
                    onChange={e => setProfileFormData({...profileFormData, specialPrice: e.target.value})}
                    className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex justify-center items-center gap-2 font-medium"
                >
                  {editingProfile ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingProfile ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Editar {selectedExams.size} Exámenes
              </h2>
              <button onClick={() => setIsBulkEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBulkEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Categoría</label>
                <select
                  required
                  value={bulkCategory}
                  onChange={e => setBulkCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Seleccione una categoría</option>
                  {EXAM_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Esta acción cambiará la categoría de los {selectedExams.size} exámenes seleccionados.
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 font-medium"
                >
                  <Check className="w-4 h-4" />
                  Aplicar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Confirmar eliminación</h3>
            </div>
            <p className="text-slate-600 mb-2">
              ¿Estás seguro de que deseas eliminar el {deleteConfirm.type === 'exam' ? 'examen' : 'perfil'} <span className="font-semibold text-slate-900">{deleteConfirm.name}</span>?
            </p>
            {deleteConfirm.type === 'exam' && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-6">
                Advertencia: Esto también lo eliminará de los perfiles que lo incluyan.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
