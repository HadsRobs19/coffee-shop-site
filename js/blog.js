/**
 * Blog functionality - fetches and renders blog posts from data API
 */

/**
 * Like storage - persists likes in localStorage
 */
const LikeStore = {
    storageKey: 'blog_likes',

    /**
     * Get all likes from storage
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    },

    /**
     * Get like data for a specific post
     */
    get(postId) {
        const likes = this.getAll();
        return likes[postId] || { count: 0, liked: false };
    },

    /**
     * Save like data for a post
     */
    save(postId, data) {
        try {
            const likes = this.getAll();
            likes[postId] = data;
            localStorage.setItem(this.storageKey, JSON.stringify(likes));
        } catch (e) {
            console.warn('Failed to save like data:', e);
        }
    }
};

/**
 * Like API - simulates server interaction with potential failure
 */
const LikeAPI = {
    // Failure rate for demo purposes (10% chance of failure)
    failureRate: 0.1,

    /**
     * Toggle like for a post (simulates API call)
     */
    async toggleLike(postId, currentLiked) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate random failure for demo
        if (Math.random() < this.failureRate) {
            throw new Error('Network error. Please try again.');
        }

        // In a real app, this would be a server call
        // For now, we just return success
        return { success: true };
    }
};

const BlogAPI = {
    // Base path for data - adjust if deploying to subdirectory
    basePath: '',

    /**
     * Fetch all blog posts
     */
    async getPosts() {
        const response = await fetch(`${this.basePath}/data/posts.json`);
        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.posts;
    },

    /**
     * Fetch a single blog post by ID
     */
    async getPost(id) {
        const posts = await this.getPosts();
        const post = posts.find(p => p.id === id);
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }
};

/**
 * Comments API - fetches and submits comments for posts
 */
const CommentsAPI = {
    basePath: '',
    failureRate: 0.1, // 10% failure rate for demo

    /**
     * Fetch comments for a specific post
     */
    async getComments(postId) {
        const response = await fetch(`${this.basePath}/data/comments.json`);
        if (!response.ok) {
            throw new Error(`Failed to load comments: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const serverComments = data.comments[postId] || [];

        // Merge with locally stored comments
        const localComments = CommentStore.get(postId);
        return [...serverComments, ...localComments];
    },

    /**
     * Submit a new comment (simulates API call)
     */
    async submitComment(postId, author, body) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simulate random failure for demo
        if (Math.random() < this.failureRate) {
            throw new Error('Failed to post comment. Please try again.');
        }

        // Create comment object
        const comment = {
            id: 'c' + Date.now(),
            author: author,
            timestamp: new Date().toISOString(),
            body: body
        };

        // In a real app, this would be saved to a server
        // For demo, we save to localStorage
        CommentStore.add(postId, comment);

        return comment;
    }
};

/**
 * Comment storage - persists user comments in localStorage
 */
const CommentStore = {
    storageKey: 'blog_comments',

    /**
     * Get all stored comments
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    },

    /**
     * Get comments for a specific post
     */
    get(postId) {
        const comments = this.getAll();
        return comments[postId] || [];
    },

    /**
     * Add a comment for a post
     */
    add(postId, comment) {
        try {
            const comments = this.getAll();
            if (!comments[postId]) {
                comments[postId] = [];
            }
            comments[postId].push(comment);
            localStorage.setItem(this.storageKey, JSON.stringify(comments));
        } catch (e) {
            console.warn('Failed to save comment:', e);
        }
    }
};

/**
 * Render blog post cards on the list page
 */
function renderBlogList(posts, container) {
    container.innerHTML = posts.map(post => `
        <article class="blog-card fade-in visible">
            <a href="blog/post.html?id=${encodeURIComponent(post.id)}" class="blog-card-link">
                <div class="blog-image" style="background-image: url('${escapeAttr(post.thumbnail)}');"></div>
                <div class="blog-content">
                    <span class="blog-meta">${escapeHtml(post.date)} &bull; ${escapeHtml(post.author)}</span>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.excerpt)}</p>
                    <span class="read-more">Read More</span>
                </div>
            </a>
        </article>
    `).join('');
}

/**
 * Render a single blog post on the detail page
 */
function renderBlogPost(post, headerContainer, contentContainer) {
    // Update page title
    document.title = `${post.title} | Alchemy Brew`;

    // Render header
    headerContainer.style.backgroundImage = `url('${post.heroImage}')`;
    headerContainer.querySelector('.blog-meta').textContent = `${post.date} \u2022 ${post.author}`;
    headerContainer.querySelector('h1').textContent = post.title;

    // Get current like state
    const likeData = LikeStore.get(post.id);

    // Render content
    const contentHTML = post.content.map(block => {
        switch (block.type) {
            case 'lead':
                return `<p class="lead">${block.text}</p>`;
            case 'paragraph':
                return `<p>${block.text}</p>`;
            case 'heading':
                return `<h2>${block.text}</h2>`;
            case 'blockquote':
                const cite = block.cite ? `<cite>— ${block.cite}</cite>` : '';
                return `<blockquote>${block.text}${cite}</blockquote>`;
            default:
                return `<p>${block.text}</p>`;
        }
    }).join('');

    contentContainer.innerHTML = contentHTML + `
        <div class="like-button-container">
            <button class="like-button ${likeData.liked ? 'liked' : ''}" data-post-id="${post.id}" aria-label="${likeData.liked ? 'Unlike this post' : 'Like this post'}" aria-pressed="${likeData.liked}">
                <span class="heart-icon" aria-hidden="true">${likeData.liked ? '&#9829;' : '&#9825;'}</span>
                <span class="like-text">${likeData.liked ? 'Liked' : 'Like'}</span>
            </button>
            <span class="like-count">${formatLikeCount(likeData.count)}</span>
            <span class="like-error"></span>
        </div>
        <div class="share-section">
            <span class="share-label">Share this post</span>
            <div class="share-buttons">
                ${navigator.share ? `
                <button class="share-btn share-native" id="share-native" data-title="${escapeAttr(post.title)}" aria-label="Share this post">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                    Share
                </button>
                ` : ''}
                <button class="share-btn share-copy" id="share-copy" aria-label="Copy link to clipboard">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    Copy link
                </button>
                <button class="share-btn share-twitter" id="share-twitter" data-title="${escapeAttr(post.title)}" aria-label="Share on Twitter">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter
                </button>
                <button class="share-btn share-facebook" id="share-facebook" aria-label="Share on Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                </button>
            </div>
        </div>
        <div class="comments-section" id="comments-section">
            <div class="comments-header">
                <h3>Comments</h3>
                <span class="comments-count" id="comments-count">...</span>
            </div>
            <div class="comments-list" id="comments-list">
                <div class="comments-loading">
                    <div class="spinner"></div>
                    <span>Loading comments...</span>
                </div>
            </div>
        </div>
        <div class="similar-posts-section" id="similar-posts-section">
            <div class="similar-posts-header">
                <h3>You Might Also Enjoy</h3>
                <p>More stories from our blog</p>
            </div>
            <div class="similar-posts-grid" id="similar-posts-grid">
                <div class="similar-posts-loading">
                    <div class="spinner"></div>
                    <span>Loading suggestions...</span>
                </div>
            </div>
        </div>
        <div class="post-footer">
            <a href="../blog.html" class="btn btn-secondary">&larr; Back to All Posts</a>
        </div>
    `;

    // Attach like button handler
    const likeButton = contentContainer.querySelector('.like-button');
    likeButton.addEventListener('click', handleLikeClick);

    // Attach share button handlers
    initShareButtons(post.title);

    // Load comments
    loadComments(post.id);

    // Load similar posts
    loadSimilarPosts(post);
}

/**
 * Initialize share buttons
 */
function initShareButtons(postTitle) {
    const shareUrl = window.location.href;

    // Native share (if available)
    const nativeBtn = document.getElementById('share-native');
    if (nativeBtn) {
        nativeBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: postTitle,
                    text: `Check out this article: ${postTitle}`,
                    url: shareUrl
                });
            } catch (err) {
                // User cancelled or share failed - ignore
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        });
    }

    // Copy link
    const copyBtn = document.getElementById('share-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shareUrl);
                showToast('Link copied to clipboard!', 'success');
            } catch (err) {
                // Fallback for older browsers
                fallbackCopyToClipboard(shareUrl);
            }
        });
    }

    // Twitter/X
    const twitterBtn = document.getElementById('share-twitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => {
            const text = encodeURIComponent(`Check out this article: ${postTitle}`);
            const url = encodeURIComponent(shareUrl);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
        });
    }

    // Facebook
    const facebookBtn = document.getElementById('share-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            const url = encodeURIComponent(shareUrl);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
        });
    }
}

/**
 * Fallback copy to clipboard for older browsers
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Link copied to clipboard!', 'success');
        } else {
            showToast('Failed to copy link', 'error');
        }
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }

    document.body.removeChild(textArea);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${type === 'success' ? '&#10003;' : '&#10007;'}</span>
        <span>${escapeHtml(message)}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Format like count for display
 */
function formatLikeCount(count) {
    if (count === 0) return 'Be the first to like this';
    if (count === 1) return '1 like';
    return `${count} likes`;
}

/**
 * Handle like button click with optimistic UI update
 */
async function handleLikeClick(event) {
    const button = event.currentTarget;

    // Prevent double-clicks while processing
    if (button.classList.contains('updating')) {
        return;
    }

    const postId = button.dataset.postId;
    const container = button.closest('.like-button-container');
    const countEl = container.querySelector('.like-count');
    const errorEl = container.querySelector('.like-error');
    const heartIcon = button.querySelector('.heart-icon');
    const likeText = button.querySelector('.like-text');

    // Get current state
    const currentData = LikeStore.get(postId);
    const wasLiked = currentData.liked;
    const previousCount = currentData.count;

    // Calculate new state
    const newLiked = !wasLiked;
    const newCount = newLiked ? previousCount + 1 : Math.max(0, previousCount - 1);

    // Optimistic UI update
    button.classList.add('updating');
    button.classList.toggle('liked', newLiked);
    button.setAttribute('aria-pressed', newLiked);
    button.setAttribute('aria-label', newLiked ? 'Unlike this post' : 'Like this post');
    heartIcon.innerHTML = newLiked ? '&#9829;' : '&#9825;';
    likeText.textContent = newLiked ? 'Liked' : 'Like';
    countEl.textContent = formatLikeCount(newCount);
    errorEl.classList.remove('visible');
    errorEl.textContent = '';

    // Save optimistically
    LikeStore.save(postId, { count: newCount, liked: newLiked });

    try {
        // Call API
        await LikeAPI.toggleLike(postId, wasLiked);

        // Success - remove updating state
        button.classList.remove('updating');

        // Trigger heart animation on like
        if (newLiked) {
            button.classList.remove('liked');
            void button.offsetWidth; // Force reflow
            button.classList.add('liked');
        }
    } catch (error) {
        // Rollback on failure
        button.classList.remove('updating');
        button.classList.toggle('liked', wasLiked);
        button.setAttribute('aria-pressed', wasLiked);
        button.setAttribute('aria-label', wasLiked ? 'Unlike this post' : 'Like this post');
        heartIcon.innerHTML = wasLiked ? '&#9829;' : '&#9825;';
        likeText.textContent = wasLiked ? 'Liked' : 'Like';
        countEl.textContent = formatLikeCount(previousCount);

        // Restore previous state in storage
        LikeStore.save(postId, { count: previousCount, liked: wasLiked });

        // Show error message
        errorEl.textContent = error.message;
        errorEl.classList.add('visible');

        // Hide error after 3 seconds
        setTimeout(() => {
            errorEl.classList.remove('visible');
        }, 3000);
    }
}

/**
 * Load and render comments for a post
 */
async function loadComments(postId) {
    const listContainer = document.getElementById('comments-list');
    const countEl = document.getElementById('comments-count');

    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));

        const comments = await CommentsAPI.getComments(postId);
        renderComments(comments, listContainer, countEl, postId);
    } catch (error) {
        console.error('Error loading comments:', error);
        listContainer.innerHTML = `
            <div class="comments-error">
                <p>Unable to load comments. ${escapeHtml(error.message)}</p>
                <button class="btn btn-secondary comments-retry-btn">Try Again</button>
            </div>
        `;
        // Attach retry handler safely
        listContainer.querySelector('.comments-retry-btn').addEventListener('click', () => loadComments(postId));
        countEl.textContent = '?';
    }
}

/**
 * Handle comment form submission
 */
async function handleCommentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-comment-btn');

    // Prevent double submission
    if (submitBtn.disabled) {
        return;
    }

    const postId = form.dataset.postId;
    const authorInput = document.getElementById('comment-author');
    const bodyInput = document.getElementById('comment-body');
    const statusEl = document.getElementById('form-status');
    const authorError = document.getElementById('author-error');
    const bodyError = document.getElementById('body-error');

    // Clear previous errors
    authorInput.classList.remove('error');
    bodyInput.classList.remove('error');
    authorError.textContent = '';
    bodyError.textContent = '';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Validate
    const author = authorInput.value.trim();
    const body = bodyInput.value.trim();
    let hasErrors = false;

    if (!author) {
        authorInput.classList.add('error');
        authorError.textContent = 'Please enter your name';
        hasErrors = true;
    } else if (author.length < 2) {
        authorInput.classList.add('error');
        authorError.textContent = 'Name must be at least 2 characters';
        hasErrors = true;
    }

    if (!body) {
        bodyInput.classList.add('error');
        bodyError.textContent = 'Please enter a comment';
        hasErrors = true;
    } else if (body.length < 10) {
        bodyInput.classList.add('error');
        bodyError.textContent = 'Comment must be at least 10 characters';
        hasErrors = true;
    }

    if (hasErrors) return;

    // Disable form while submitting
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    statusEl.textContent = 'Submitting your comment...';

    try {
        // Submit comment
        const comment = await CommentsAPI.submitComment(postId, author, body);

        // Success - add comment to list
        appendComment(comment);

        // Update count
        const countEl = document.getElementById('comments-count');
        const currentCount = parseInt(countEl.textContent, 10);
        countEl.textContent = (isNaN(currentCount) ? 0 : currentCount) + 1;

        // Remove empty state if present
        const emptyState = document.querySelector('.comments-empty');
        if (emptyState) {
            emptyState.remove();
        }

        // Clear form
        authorInput.value = '';
        bodyInput.value = '';

        // Show success
        statusEl.textContent = 'Comment posted successfully!';
        statusEl.className = 'form-status success';

        // Clear success message after 3 seconds
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
        }, 3000);

    } catch (error) {
        console.error('Error posting comment:', error);
        statusEl.textContent = error.message;
        statusEl.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
    }
}

/**
 * Append a new comment to the list
 */
function appendComment(comment) {
    const container = document.getElementById('comments-list');
    const formContainer = container.querySelector('.comment-form-container');

    const commentHTML = `
        <div class="comment new-comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.author)}</span>
                <span class="comment-timestamp">${formatCommentTimestamp(comment.timestamp)}</span>
            </div>
            <p class="comment-body">${escapeHtml(comment.body)}</p>
        </div>
    `;

    // Insert before the form
    formContainer.insertAdjacentHTML('beforebegin', commentHTML);

    // Scroll to the new comment
    const newComment = container.querySelector('.new-comment');
    newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Render comments list
 */
function renderComments(comments, container, countEl, postId) {
    // Update count
    countEl.textContent = comments.length;

    let commentsHTML = '';

    if (comments.length === 0) {
        commentsHTML = `
            <div class="comments-empty">
                <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
        `;
    } else {
        commentsHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.author)}</span>
                    <span class="comment-timestamp">${formatCommentTimestamp(comment.timestamp)}</span>
                </div>
                <p class="comment-body">${escapeHtml(comment.body)}</p>
            </div>
        `).join('');
    }

    // Add comment form
    const formHTML = `
        <div class="comment-form-container">
            <h4>Leave a Comment</h4>
            <form class="comment-form" id="comment-form" data-post-id="${postId}">
                <div class="form-row">
                    <div class="form-field">
                        <label for="comment-author">Name</label>
                        <input type="text" id="comment-author" name="author" placeholder="Your name" maxlength="50">
                        <span class="field-error" id="author-error"></span>
                    </div>
                </div>
                <div class="form-field">
                    <label for="comment-body">Comment</label>
                    <textarea id="comment-body" name="body" placeholder="Share your thoughts..." maxlength="1000"></textarea>
                    <span class="field-error" id="body-error"></span>
                </div>
                <div class="comment-form-actions">
                    <button type="submit" class="btn btn-primary" id="submit-comment-btn">Post Comment</button>
                    <span class="form-status" id="form-status"></span>
                </div>
            </form>
        </div>
    `;

    container.innerHTML = commentsHTML + formHTML;

    // Attach form handler
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', handleCommentSubmit);
}

/**
 * Format comment timestamp for display
 */
function formatCommentTimestamp(isoString) {
    const date = new Date(isoString);

    // Handle invalid dates
    if (isNaN(date.getTime())) {
        return 'Unknown date';
    }

    const now = new Date();
    const diffMs = now - date;

    // Handle future dates
    if (diffMs < 0) {
        return 'Just now';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
        }
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    // Format as date for older comments
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Escape text for use in HTML attributes
 */
function escapeAttr(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Load and render similar posts
 */
async function loadSimilarPosts(currentPost) {
    const container = document.getElementById('similar-posts-grid');

    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get all posts
        const allPosts = await BlogAPI.getPosts();

        // Get similar posts
        const similarPosts = getSimilarPosts(currentPost, allPosts, 3);

        renderSimilarPosts(similarPosts, container);
    } catch (error) {
        console.error('Error loading similar posts:', error);
        container.innerHTML = `
            <div class="similar-posts-empty">
                <p>Unable to load suggestions</p>
            </div>
        `;
    }
}

/**
 * Get similar posts based on category and recency
 */
function getSimilarPosts(currentPost, allPosts, count = 3) {
    // Filter out current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

    // Score posts based on similarity
    const scoredPosts = otherPosts.map(post => {
        let score = 0;

        // Same category = high score
        if (post.category === currentPost.category) {
            score += 10;
        }

        // Recency bonus (newer posts score slightly higher)
        const postDate = new Date(post.dateISO);
        const daysSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 5 - (daysSincePost / 30)); // Up to 5 points for posts within last month

        return { post, score };
    });

    // Sort by score (descending) and take top N
    scoredPosts.sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, count).map(item => item.post);
}

/**
 * Render similar posts grid
 */
function renderSimilarPosts(posts, container) {
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="similar-posts-empty">
                <p>No similar posts found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => `
        <a href="post.html?id=${encodeURIComponent(post.id)}" class="similar-post-card">
            <div class="similar-post-image" style="background-image: url('${escapeAttr(post.thumbnail)}');"></div>
            <div class="similar-post-content">
                <span class="similar-post-category">${escapeHtml(post.category)}</span>
                <h4>${escapeHtml(post.title)}</h4>
                <span class="similar-post-meta">${escapeHtml(post.date)} &bull; ${escapeHtml(post.author)}</span>
            </div>
        </a>
    `).join('');
}

/**
 * Show loading spinner
 */
function showLoading(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

/**
 * Show error message
 */
function showError(container, message, retryCallback) {
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">!</div>
            <h3>Something went wrong</h3>
            <p>${escapeHtml(message)}</p>
            ${retryCallback ? '<button class="btn btn-secondary retry-btn">Try Again</button>' : ''}
        </div>
    `;

    if (retryCallback) {
        container.querySelector('.retry-btn').addEventListener('click', retryCallback);
    }
}

/**
 * Initialize blog list page
 */
async function initBlogList() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    const loadPosts = async () => {
        showLoading(container);

        try {
            // Simulate network delay for demo purposes (remove in production)
            await new Promise(resolve => setTimeout(resolve, 300));

            const posts = await BlogAPI.getPosts();
            renderBlogList(posts, container);
        } catch (error) {
            console.error('Error loading posts:', error);
            showError(container, error.message, loadPosts);
        }
    };

    await loadPosts();
}

/**
 * Initialize blog detail page
 */
async function initBlogPost() {
    const headerContainer = document.getElementById('blog-post-header');
    const contentContainer = document.getElementById('blog-post-body');

    if (!headerContainer || !contentContainer) return;

    // Get post ID from URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        showError(contentContainer, 'No post specified. Please select a post from the blog page.');
        return;
    }

    const loadPost = async () => {
        showLoading(contentContainer);

        try {
            // Simulate network delay for demo purposes (remove in production)
            await new Promise(resolve => setTimeout(resolve, 300));

            // Adjust base path for blog subdirectory
            BlogAPI.basePath = '..';
            CommentsAPI.basePath = '..';

            const post = await BlogAPI.getPost(postId);
            renderBlogPost(post, headerContainer, contentContainer);
        } catch (error) {
            console.error('Error loading post:', error);
            showError(contentContainer, error.message, loadPost);
        }
    };

    await loadPost();
}

// Auto-initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on and initialize accordingly
    if (document.getElementById('blog-grid')) {
        initBlogList();
    } else if (document.getElementById('blog-post-header')) {
        initBlogPost();
    }
});
