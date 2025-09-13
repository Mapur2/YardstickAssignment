import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Archive, 
  Calendar, 
  User,
  Tag,
  MoreVertical,
  RefreshCw
} from 'lucide-react';

const NotesList = ({ notes, onEdit, onDelete, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [showMenuId, setShowMenuId] = useState(null);

  const handleDelete = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      setDeletingId(note._id);
      try {
        await onDelete(note._id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (notes.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first note</p>
        <button
          onClick={onRefresh}
          className="btn-secondary flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="card-hover group relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {note.content}
                </p>
                
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta information */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{note.author?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  {note.isArchived && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Archive className="h-3 w-3" />
                      <span>Archived</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenuId(showMenuId === note._id ? null : note._id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showMenuId === note._id && (
                  <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        onEdit(note);
                        setShowMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(note);
                        setShowMenuId(null);
                      }}
                      disabled={deletingId === note._id}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{deletingId === note._id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
