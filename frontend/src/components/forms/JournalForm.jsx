import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { api } from '../../services/api';

const JournalForm = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await api.createJournalEntry({
        title: title || null,
        content,
        mood: mood || null,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        is_private: true,
      });
      setSuccess(true);
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="animate-bounce text-6xl mb-4">📖</div>
        <h3 className="text-2xl font-bold text-purple-600 mb-2">Journal Entry Saved!</h3>
        <p className="text-gray-600">Your thoughts are safely stored. Keep reflecting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-4xl mb-2">📖</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Digital Journal
        </h3>
        <p className="text-gray-600 mt-2">Express your thoughts and feelings freely</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">✨ Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            placeholder="Give your entry a meaningful title..."
          />
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">💭 Your thoughts</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            rows={8}
            placeholder="What's on your mind? There's no right or wrong way to journal..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">😊 Current mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all"
            >
              <option value="">How are you feeling?</option>
              <option value="very_low">😞 Very Low</option>
              <option value="low">😔 Low</option>
              <option value="neutral">😐 Neutral</option>
              <option value="good">😊 Good</option>
              <option value="excellent">😄 Excellent</option>
            </select>
          </div>
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">🏷️ Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
              placeholder="gratitude, work, family, dreams"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </div>
          ) : (
            '📖 Save Entry'
          )}
        </button>
      </form>
    </div>
  );
};

export default JournalForm;