import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Dot, ArrowLeft } from 'lucide-react';


const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
};

// --- MOCK DATA ---
const allPosts = [
  {
    id: 1,
    user: 'React Dev',
    handle: '@react_guru',
    avatar: 'https://placehold.co/100x100/536471/ffffff?text=RD',
    timestamp: '4h',
    content: "Just finished building a Twitter post clone using React and Tailwind CSS! It's amazing how quickly you can create complex, responsive UI components. State management for likes and comments is the key. #ReactJS #TailwindCSS",
    initialLikes: 154,
    retweets: 48,
    comments: [
      { id: 101, user: 'Tailwind Fan', handle: '@css_wizard', avatar: 'https://placehold.co/100x100/1DA1F2/ffffff?text=TF', content: 'The responsiveness looks great! Did you use `flex` or `grid` for the main layout?', timestamp: '3h', likes: 5 },
      { id: 102, user: 'JS Master', handle: '@code_prodigy', avatar: 'https://placehold.co/100x100/FFD43B/000000?text=JM', content: 'Nice! The comments thread implementation is clean. State handling for deep nesting can get tricky, but this seems well organized.', timestamp: '2h', likes: 12 },
    ],
  },
  {
    id: 2,
    user: 'Web Explorer',
    handle: '@explorer_max',
    avatar: 'https://placehold.co/100x100/1DA1F2/ffffff?text=ME',
    timestamp: '1d',
    content: "The future of web development is definitely component-based architecture. Thinking modularly saves so much time in the long run. Anyone else agree?",
    initialLikes: 987,
    retweets: 123,
    comments: [
      { id: 201, user: 'Module Man', handle: '@mod_man', avatar: 'https://placehold.co/100x100/00BA7C/ffffff?text=MM', content: 'Absolutely! Separating concerns is crucial for maintenance.', timestamp: '20h', likes: 15 },
    ],
  },
  {
    id: 3,
    user: 'Design Hub',
    handle: '@design_daily',
    avatar: 'https://placehold.co/100x100/FF5500/ffffff?text=DH',
    timestamp: '2d',
    content: "Accessibility is not a feature, it's a foundation. Always test your color contrast and keyboard navigation! #a11y",
    initialLikes: 2401,
    retweets: 550,
    comments: [],
  },
];
// --- END MOCK DATA ---


// Component for an individual comment in the thread
const Comment = ({ comment }) => {
  return (
    <div className="flex space-x-3 p-4 border-b border-gray-800 hover:bg-gray-900 transition duration-150">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={comment.avatar}
        alt={`${comment.user}'s avatar`}
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/536471/ffffff?text=USR" }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-white hover:underline cursor-pointer truncate">{comment.user}</span>
          <span className="text-gray-500 truncate">{comment.handle}</span>
          <Dot className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">{comment.timestamp}</span>
        </div>
        <p className="text-gray-200 mt-1 break-words">{comment.content}</p>
        
        {/* Mock Comment Actions */}
        <div className="flex mt-3 space-x-10 text-gray-500">
          <div className="flex items-center group cursor-pointer">
            <MessageCircle className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
            <span className="text-xs ml-1 group-hover:text-blue-400">{formatCount(1)}</span>
          </div>
          <div className="flex items-center group cursor-pointer">
            <Heart className="w-4 h-4 group-hover:text-red-500 transition-colors" />
            <span className="text-xs ml-1 group-hover:text-red-500">{formatCount(comment.likes)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};



const CommentThread = ({ post, onAddComment }) => {
  const [newCommentText, setNewCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      onAddComment(post.id, newCommentText.trim());
      setNewCommentText('');
    }
  };

  return (
    <div className="bg-gray-900">
      <h2 className="text-lg font-semibold text-white p-4 border-b border-gray-800">
        Comments Thread ({post.comments.length})
      </h2>
      
      {/* Input for New Comment */}
      <form onSubmit={handleCommentSubmit} className="p-4 border-b border-gray-800 flex space-x-3 items-start">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src="https://placehold.co/100x100/536471/ffffff?text=YOU"
          alt="Your avatar"
        />
        <div className="flex-1">
            <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Post your reply..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="mt-2 px-4 py-1.5 bg-blue-500 text-white font-bold rounded-full text-sm hover:bg-blue-600 transition disabled:opacity-50"
                disabled={!newCommentText.trim()}
            >
                Reply
            </button>
        </div>
      </form>

      {/* Render Comments */}
      {post.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}

      <div className="p-4 text-center text-gray-500 text-sm">
        End of Thread
      </div>
    </div>
  );
}



const PostDetail = ({ post, onAddComment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.initialLikes);

  const displayLikes = useMemo(() => formatCount(likes), [likes]);

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikes(prev => prev + (isLiked ? -1 : 1));
  };

  const actionClass = "flex items-center space-x-2 p-2 rounded-full transition duration-200 cursor-pointer text-gray-500";
  const iconClass = "w-5 h-5";

  return (
    <>

      <div className="border-b border-gray-800 bg-gray-950 p-4 sm:p-5">
        <div className="flex space-x-3 mb-4">
 
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={post.avatar}
            alt={`${post.user}'s avatar`}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/536471/ffffff?text=RD" }}
          />


          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-white block hover:underline cursor-pointer truncate">{post.user}</span>
            <span className="text-gray-500 truncate">{post.handle}</span>
          </div>
        </div>
        
 
        <p className="text-gray-200 text-xl break-words leading-relaxed mb-4">
          {post.content.split(' ').map((word, index) => {
            if (word.startsWith('#')) {
              return (
                <span key={index} className="text-blue-400 hover:underline cursor-pointer mr-1">
                  {word}
                </span>
              );
            }
            return <span key={index} className="mr-1">{word}</span>;
          })}
        </p>
        

        <div className="text-sm text-gray-500 border-t border-b border-gray-800 py-3 mb-4">
            {post.timestamp}
        </div>



        <div className="flex justify-between max-w-lg mt-4">
          {/* Comment Button (Non-clickable here, just shows count) */}
          <div className={`${actionClass} group hover:text-blue-400 hover:bg-blue-900/20`}>
            <MessageCircle className={iconClass} />
            <span className="text-sm">{formatCount(post.comments.length)}</span>
          </div>

    
          <div className={`${actionClass} group hover:text-green-400 hover:bg-green-900/20`}>
            <Repeat2 className={iconClass} />
            <span className="text-sm">{formatCount(post.retweets)}</span>
          </div>

  
          <div className={`${actionClass} group hover:text-red-500 hover:bg-red-900/20`} onClick={handleLike}>
            <Heart
              className={iconClass}
              fill={isLiked ? 'rgb(239 68 68)' : 'none'}
              stroke={isLiked ? 'rgb(239 68 68)' : 'currentColor'}
            />
            <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
              {displayLikes}
            </span>
          </div>

          <div className={`${actionClass} group hover:text-blue-400 hover:bg-blue-900/20`}>
            <Share className={iconClass} />
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <CommentThread post={post} onAddComment={onAddComment} />
    </>
  );
};


const PostFeedItem = ({ post, onClick }) => {
  return (
    <div 
      className="flex space-x-3 p-4 border-b border-gray-800 hover:bg-gray-900 transition duration-150 cursor-pointer"
      onClick={() => onClick(post.id)}
    >
   
      <img
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        src={post.avatar}
        alt={`${post.user}'s avatar`}
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/536471/ffffff?text=RD" }}
      />

  
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-white hover:underline cursor-pointer truncate">{post.user}</span>
          <span className="text-gray-500 truncate">{post.handle}</span>
          <Dot className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">{post.timestamp}</span>
        </div>
        
        <p className="text-gray-200 mt-1 text-sm break-words line-clamp-2">{post.content}</p>
        
       
        <div className="flex mt-3 space-x-6 text-gray-500 text-xs">
          <div className="flex items-center">
            <MessageCircle className="w-3.5 h-3.5 mr-1" />
            {formatCount(post.comments.length)}
          </div>
          <div className="flex items-center">
            <Repeat2 className="w-3.5 h-3.5 mr-1" />
            {formatCount(post.retweets)}
          </div>
          <div className="flex items-center">
            <Heart className="w-3.5 h-3.5 mr-1" />
            {formatCount(post.initialLikes)}
          </div>
        </div>
      </div>
    </div>
  );
};



const HomeFeed = ({ posts, onSelectPost }) => {
    return (
        <>
            <h1 className="text-xl font-bold text-white p-4 border-b border-gray-800 bg-gray-900">
                Home Feed
            </h1>
            <div className="bg-gray-950">
                {posts.map(post => (
                    <PostFeedItem key={post.id} post={post} onClick={onSelectPost} />
                ))}
            </div>
            <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-800">
                You've reached the end of the mock feed.
            </div>
        </>
    );
}


export default function App() {
  const [posts, setPosts] = useState(allPosts);
  const [selectedPostId, setSelectedPostId] = useState(null);
  
  const selectedPost = posts.find(p => p.id === selectedPostId);

  
  const handleAddComment = (postId, text) => {
    const newComment = {
      id: Date.now(), 
      user: 'Current User',
      handle: '@you',
      avatar: 'https://placehold.co/100x100/536471/ffffff?text=YOU',
      content: text,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const navigateBack = () => setSelectedPostId(null);
  
  return (
    <div className="min-h-screen bg-black font-sans flex justify-center py-8">
   
      <div className="w-full max-w-xl border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        
       
        {selectedPost && (
            <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900">
                <button 
                    onClick={navigateBack} 
                    className="p-1 rounded-full text-white hover:bg-gray-800 transition mr-4"
                    aria-label="Go back to home feed"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white">Post</h1>
            </div>
        )}

  
        {selectedPost ? (
           
            <PostDetail post={selectedPost} onAddComment={handleAddComment} />
        ) : (
            
            <HomeFeed posts={posts} onSelectPost={setSelectedPostId} />
        )}

      </div>
    </div>
  );
}