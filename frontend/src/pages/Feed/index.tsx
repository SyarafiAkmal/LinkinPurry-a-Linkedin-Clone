import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FeedCard from '@/components/FeedCard/feedcard';
import { parseISO } from 'date-fns';

interface FeedPost {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
}

const Feed = () => {
  const { feed_id } = useParams<{ feed_id?: string }>();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [feed_id]);

  const fetchPosts = async (cursor?: number, append = false) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/feed', {
        params: { cursor, limit: 5 },
        withCredentials: true,
      });
      console.log(response.data);
      const newPosts = response.data.body?.body || [];
      const newCursor = response.data.body?.nextCursor || null;

      if (newPosts.length === 0 && !append) {
        setPosts([]);
      } else if (newPosts.length > 0) {
        setPosts((prevPosts) =>
          append ? [...prevPosts, ...newPosts] : newPosts
        );
      }
      setNextCursor(newCursor);
      setIsLoading(false);
    } catch {
      setError('Failed to fetch posts');
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor !== null) {
      fetchPosts(nextCursor, true); 
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/feed',
        { content: newPostContent },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const newPost: FeedPost = response.data.body;
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setNewPostContent('');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to create post');
    }
  };

  const handleEdit = async (id: number, newContent: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/feed/${id}`,
        { content: newContent },
        { withCredentials: true }
      );
      setPosts(posts.map((post) => (post.id === id ? response.data.body : post)));
    } catch (error) {
      console.log(error);
      setError('Failed to edit post');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/feed/${id}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch {
      setError('Failed to delete post');
    }
  };

  if (isLoading && posts.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleCreate} className="mb-4">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
      {!posts.length ? (
        <div className="text-center text-gray-500">No feed posted yet</div>
      ) : (
        posts.map((post) => (
          <FeedCard
            key={post.id}
            content={post.content}
            created_at={parseISO(post.created_at)}
            updated_at={parseISO(post.updated_at)}
            onDelete={() => handleDelete(post.id)}
            author={post.author}
            onEdit={(newContent: string) => handleEdit(post.id, newContent)}
          />
        ))
      )}
      {nextCursor && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Feed;