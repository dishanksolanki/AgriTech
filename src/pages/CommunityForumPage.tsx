import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { ForumPost, ForumComment, ForumCategory } from '../types';
import { 
  MessageSquare, ThumbsUp, Plus, Search, Filter, 
  Flag, AlertCircle, X, Send, ShieldCheck, Check 
} from 'lucide-react';

export const CommunityForumPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New Post Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Crop Management');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [reportedNotif, setReportedNotif] = useState(false);

  const categories: (ForumCategory | 'All')[] = [
    'All',
    'Crop Management',
    'Soil Health',
    'Irrigation',
    'Pest Control',
    'Farming Equipment',
    'Government Schemes',
    'General Discussion',
  ];

  const loadPosts = () => {
    const list = StorageService.getForumPosts();
    setPosts(list);
    if (activePost) {
      const updated = list.find(p => p.id === activePost.id);
      if (updated) {
        setActivePost(updated);
        setComments(StorageService.getForumComments(updated.id));
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openPostDetails = (p: ForumPost) => {
    setActivePost(p);
    setComments(StorageService.getForumComments(p.id));
    setNewCommentText('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      setError('Please provide a title and explanation for your post.');
      return;
    }

    StorageService.createForumPost({
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      category,
      title,
      content,
    });

    setIsNewPostModalOpen(false);
    setTitle('');
    setContent('');
    setError(null);
    loadPosts();
  };

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    StorageService.toggleUpvotePost(postId, user.id);
    loadPosts();
  };

  const handleReport = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.reportPost(postId);
    setReportedNotif(true);
    setTimeout(() => setReportedNotif(false), 2500);
    loadPosts();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activePost || !newCommentText.trim()) return;

    StorageService.addForumComment({
      postId: activePost.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: newCommentText.trim(),
    });

    setNewCommentText('');
    setComments(StorageService.getForumComments(activePost.id));
    loadPosts();
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.forum}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Exchange ground-level farming techniques, subsidy verification, and equipment reviews.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsNewPostModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Discussion</span>
        </button>
      </div>

      {reportedNotif && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 rounded-lg">
          Post flagged for administrative moderation review.
        </div>
      )}

      {/* Main Grid: Discussion Feed + Active Post Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feed & Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, schemes, or farming practices..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-medium">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#14532D] text-white font-bold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-neutral-200 text-center text-xs text-neutral-400">
              No discussions found matching this category.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const isSelected = activePost?.id === post.id;
                const hasUpvoted = user && post.upvotedBy.includes(user.id);

                return (
                  <div
                    key={post.id}
                    onClick={() => openPostDetails(post)}
                    className={`bg-white p-5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected ? 'border-[#14532D] ring-1 ring-[#14532D]/20 shadow-xs' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {post.category}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-medium text-neutral-800">{post.authorName}</span>
                        {post.authorRole === 'admin' && (
                          <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 rounded">Admin</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Upvote button */}
                        <button
                          type="button"
                          onClick={(e) => handleUpvote(post.id, e)}
                          className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded transition-colors ${
                            hasUpvoted ? 'bg-emerald-100 text-[#14532D]' : 'hover:bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{post.upvotes}</span>
                        </button>

                        {/* Comments count */}
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{post.commentsCount}</span>
                        </div>

                        {/* Report button */}
                        <button
                          type="button"
                          onClick={(e) => handleReport(post.id, e)}
                          title="Report Inappropriate Content"
                          className="text-neutral-300 hover:text-red-500 p-1"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Post Thread & Comments (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activePost ? (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
              <div className="pb-3 border-b border-neutral-100">
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {activePost.category}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-2 leading-snug">
                  {activePost.title}
                </h3>
                <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                  <span>By <strong>{activePost.authorName}</strong></span>
                  <span>·</span>
                  <span>{new Date(activePost.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {activePost.content}
              </div>

              {/* Comments Section */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Community Replies ({comments.length})
                </h4>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {comments.length === 0 ? (
                    <div className="text-xs text-neutral-400 py-4 text-center">
                      No replies yet. Be the first to share your field experience.
                    </div>
                  ) : (
                    comments.map((com) => (
                      <div key={com.id} className="p-3 bg-[#F8F7F0] rounded-lg border border-neutral-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-900">
                          <span>{com.authorName} {com.authorRole === 'admin' ? '(Agronomist)' : ''}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            {new Date(com.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-neutral-600 leading-relaxed text-[11px]">{com.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write constructive agricultural advice..."
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#14532D] text-white rounded-lg hover:bg-[#0f3e22] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-neutral-200 text-center text-xs text-neutral-400">
              Select any topic from the feed to view discussions and add your field notes.
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Start a Community Discussion
              </h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best bio-fungicide for wheat rust prevention?"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                >
                  <option value="Crop Management">Crop Management</option>
                  <option value="Soil Health">Soil Health</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Farming Equipment">Farming Equipment</option>
                  <option value="Government Schemes">Government Schemes</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Discussion Content & Observations *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share plot context, variety, soil characteristics, or specific questions for fellow farmers..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-md hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-md hover:bg-[#0f3e22] cursor-pointer"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
