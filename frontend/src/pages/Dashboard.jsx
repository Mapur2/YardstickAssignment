import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI, tenantAPI } from '../services/api';
// import { testConnection, testLogin } from '../utils/testConnection';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';
import TenantInfo from '../components/TenantInfo';
import { 
  Plus, 
  FileText, 
  Crown, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);      
      const [notesResponse, tenantResponse] = await Promise.all([
        notesAPI.getNotes(),
        tenantAPI.getInfo()
      ]);
      
      setNotes(notesResponse.data.notes);
      setTenantInfo(tenantResponse.data.tenant);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      setNotes(prev => [response.data.note, ...prev]);
      setShowNoteForm(false);
      await loadData(); // Refresh tenant info to update note count
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data.message);
      } else {
        setError('Failed to create note');
      }
      throw error;
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      setNotes(prev => prev.map(note => 
        note._id === id ? response.data.note : note
      ));
      setEditingNote(null);
    } catch (error) {
      setError('Failed to update note');
      throw error;
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
      await loadData(); // Refresh tenant info to update note count
    } catch (error) {
      setError('Failed to delete note');
    }
  };

  const handleUpgrade = async () => {
    try {
      await tenantAPI.upgrade(user.tenant.slug);
      await loadData(); // Refresh tenant info
      setError('');
    } catch (error) {
      setError('Failed to upgrade tenant');
    }
  };

  const canCreateNote = tenantInfo?.canCreateMore || false;
  const isAtLimit = !canCreateNote && tenantInfo?.subscription?.plan === 'free';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your notes and tenant information</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNoteForm(true)}
            disabled={!canCreateNote}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{tenantInfo?.noteCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize flex items-center">
                {tenantInfo?.subscription?.plan || 'free'}
                {tenantInfo?.subscription?.plan === 'pro' && (
                  <Crown className="h-5 w-5 text-yellow-500 ml-1" />
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Your Role</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      {isAtLimit && user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Upgrade to Pro</h3>
                <p className="text-yellow-700">
                  You've reached the free plan limit of {tenantInfo?.subscription?.noteLimit} notes.
                </p>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="btn-primary bg-yellow-600 hover:bg-yellow-700"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-2">
          <NotesList
            notes={notes}
            onEdit={setEditingNote}
            onDelete={handleDeleteNote}
            onRefresh={loadData}
          />
        </div>

        {/* Tenant Info */}
        <div className="lg:col-span-1">
          <TenantInfo
            tenantInfo={tenantInfo}
            user={user}
            onUpgrade={handleUpgrade}
          />
        </div>
      </div>

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onClose={() => setShowNoteForm(false)}
          onSubmit={handleCreateNote}
          title="Create New Note"
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <NoteForm
          onClose={() => setEditingNote(null)}
          onSubmit={(data) => handleUpdateNote(editingNote._id, data)}
          note={editingNote}
          title="Edit Note"
        />
      )}
    </div>
  );
};

export default Dashboard;
