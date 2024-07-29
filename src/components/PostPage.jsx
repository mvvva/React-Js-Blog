import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PostPage = ({ setPosts, posts, handleDelete }) => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post ? post.title : "");
    const [editBody, setEditBody] = useState(post ? post.body : "");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const base_url = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        if (post) {
            setEditTitle(post.title);
            setEditBody(post.body);
        }
    }, [post]);

    const handleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`${base_url}/posts/${post.id}`, {
                title: editTitle,
                body: editBody
            });

            const updatedPost = { id: post.id, title: editTitle, body: editBody };
            const updatedPosts = posts.map(p => (p.id === id ? updatedPost : p));
            setPosts(updatedPosts);
            setIsEditing(false);
        } catch (error) {
            setError("Error updating post: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        setDeleting(true);
        setError(null);
        try {
            await axios.delete(`${base_url}/posts/${postId}`);
            const filteredPosts = posts.filter(post => post.id !== postId);
            setPosts(filteredPosts);
            navigate('/');
        } catch (error) {
            setError("Error deleting post: " + error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="PostPage">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <article className="post">
                {post ? (
                    <>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        fontSize: '2rem',
                                        marginBottom: '1rem',
                                        fontFamily: 'inherit',
                                    }}
                                />
                                <textarea
                                    value={editBody}
                                    onChange={(e) => setEditBody(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        fontSize: '1rem',
                                        marginBottom: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <h2>{post.title}</h2>
                                <p className="postDate">{post.datetime}</p>
                                <p className="postBody">{post.body}</p>
                            </>
                        )}
                        <button
                            onClick={handleEdit}
                            style={{ background: isEditing ? '#007BFF' : '#FFD700', color: 'white' }}
                            disabled={loading || deleting}
                        >
                            {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit Post'}
                        </button>
                        <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ background: deleting ? '#FF6347' : '#FF6347', color: 'white', marginLeft: '15px' }}
                            disabled={deleting || loading}
                        >
                            {deleting ? 'Deleting...' : 'Delete Post'}
                        </button>
                    </>
                ) : (
                    <>
                        <h2>Post Not Found</h2>
                        <p>Well, that's disappointing.</p>
                        <p>
                            <Link to='/'>Visit Our Homepage</Link>
                        </p>
                    </>
                )}
            </article>
        </main>
    );
};

export default PostPage;
