import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createPost, 
  fetchPosts, 
  createComment, 
  likeComment 
} from './postsSlice';
import { RootState, AppDispatch } from '../../app/store';
import './posts.scss';

const PostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Add more detailed logging
  const posts = useSelector((state: RootState) => {
    console.log('Full Redux state:', state);
    console.log('Posts state:', state.posts);
    console.log('Posts items:', state.posts.items);
    
    // Add type checking and logging
    if (!Array.isArray(state.posts.items)) {
      console.error('Posts is not an array:', typeof state.posts.items, state.posts.items);
      return [];
    }
    return state.posts.items;
  });
  
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [commentContents, setCommentContents] = useState<{[postId: string]: string}>({});

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const result = await dispatch(fetchPosts());
        console.log('Fetch posts result:', result);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPostsData();
  }, [dispatch]);

  const handleCreatePost = () => {
    dispatch(createPost({ 
      content: postContent, 
      file: selectedFile || undefined 
    }));

    // Reset form
    setPostContent('');
    setSelectedFile(null);
  };

  const handleCreateComment = (postId: string) => {
    if (commentContents[postId]) {
      dispatch(createComment({
        postId,
        content: commentContents[postId]
      }));

      // Reset comment input
      setCommentContents(prev => ({...prev, [postId]: ''}));
    }
  };

  const handleLikeComment = (postId: string, commentId: string, isLike: boolean) => {
    dispatch(likeComment({ postId, commentId, isLike }));
  };

  // Add loading and error states
  const postsStatus = useSelector((state: RootState) => state.posts.status);
  const postsError = useSelector((state: RootState) => state.posts.error);

  // Render loading or error states
  if (postsStatus === 'loading') {
    return <div>Loading posts...</div>;
  }

  if (postsStatus === 'failed') {
    return <div>Error loading posts: {postsError}</div>;
  }

  return (
    <div className="posts-container">
      {/* Create Post Section */}
      <div className="create-post">
        <textarea 
          className="create-post__textarea"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <div className="create-post__actions">
          <div className="file-upload">
            <input 
              type="file" 
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              accept="image/*"
            />
          </div>
          <button 
            className="post-button"
            onClick={handleCreatePost}
            disabled={!postContent}
          >
            Post
          </button>
        </div>
      </div>

      {/* Check if posts exists and is an array before mapping */}
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="post">
            <div>{post.content}</div>
            
            {/* Media Display */}
            {post.media && (
              <img 
                src={post.media.url} 
                alt="Post media" 
                className="post__media" 
              />
            )}

            {/* Comments Section */}
            <div className="comments">
              {/* Comment Input */}
              <div className="comments__input">
                <input 
                  value={commentContents[post.id!] || ''}
                  onChange={(e) => setCommentContents(prev => ({
                    ...prev, 
                    [post.id!]: e.target.value
                  }))}
                  placeholder="Add a comment"
                />
                <button 
                  onClick={() => handleCreateComment(post.id!)}
                  disabled={!commentContents[post.id!]}
                >
                  Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="comments__list">
                {post.comments?.map(comment => (
                  <div key={comment.id} className="comment">
                    <div>{comment.content}</div>
                    <div className="comment__actions">
                      <button 
                        onClick={() => handleLikeComment(post.id!, comment.id!, true)}
                      >
                        👍 {comment.likes || 0}
                      </button>
                      <button 
                        onClick={() => handleLikeComment(post.id!, comment.id!, false)}
                      >
                        👎 {comment.dislikes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
};

export default PostsPage;