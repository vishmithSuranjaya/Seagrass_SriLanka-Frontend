import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Users, X, Save, Eye, EyeOff } from 'lucide-react';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching events from API
    const mockEvents = [
      {
        event_id: '1',
        title: 'Annual Tech Conference',
        description: 'Join us for the biggest tech event of the year featuring industry leaders and innovative technologies.',
        event_date: '2024-07-15',
        event_time: '09:00',
        location: 'Convention Center, Colombo',
        max_participants: 500,
        created_at: '2024-06-01T10:00:00Z',
        updated_at: '2024-06-01T10:00:00Z',
        image: null,
        is_published: true
      },
      {
        event_id: '2',
        title: 'Community Workshop',
        description: 'A hands-on workshop focusing on community development and engagement strategies.',
        event_date: '2024-07-20',
        event_time: '14:30',
        location: 'Community Hall, Kalutara',
        max_participants: 100,
        created_at: '2024-06-05T15:30:00Z',
        updated_at: '2024-06-05T15:30:00Z',
        image: null,
        is_published: false
      }
    ];
    setEvents(mockEvents);
  }, []);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowAddModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <p className="text-gray-600 mt-2">Manage all events from your dashboard</p>
            </div>
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Event
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">Start by creating your first event</p>
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Event
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <EventModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          event={null}
          onSave={(eventData) => {
            // Add event logic here
            console.log('Adding event:', eventData);
            setShowAddModal(false);
          }}
          title="Add New Event"
        />
      )}

      {showEditModal && (
        <EventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          event={selectedEvent}
          onSave={(eventData) => {
            // Update event logic here
            console.log('Updating event:', eventData);
            setShowEditModal(false);
          }}
          title="Edit Event"
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          event={selectedEvent}
          onConfirm={() => {
            // Delete event logic here
            console.log('Deleting event:', selectedEvent?.event_id);
            setEvents(events.filter(e => e.event_id !== selectedEvent?.event_id));
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Event Card Component
function EventCard({ event, onEdit, onDelete, formatDate, formatTime }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">{event.title}</h3>
          <div className="flex items-center gap-2 ml-2">
            {event.is_published ? (
              <Eye size={16} className="text-green-600" title="Published" />
            ) : (
              <EyeOff size={16} className="text-gray-400" title="Unpublished" />
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{formatDate(event.event_date)} at {formatTime(event.event_time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} />
            <span>Max {event.max_participants} participants</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            <Clock size={14} className="inline mr-1" />
            Updated {new Date(event.updated_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit event"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete event"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Event Modal Component
function EventModal({ isOpen, onClose, event, onSave, title }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_participants: '',
    is_published: true
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date || '',
        event_time: event.event_time || '',
        location: event.location || '',
        max_participants: event.max_participants || '',
        is_published: event.is_published ?? true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        max_participants: '',
        is_published: true
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Participants
            </label>
            <input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
              Publish event immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSave(formData);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, event, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete the event "{event?.title}"?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;