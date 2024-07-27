import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PostPage = ({ posts, handleDelete, handleEditSubmit }) => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post ? post.title : "");
    const [editBody, setEditBody] = useState(post ? post.body : "");

    useEffect(() => {
        if (post) {
            setEditTitle(post.title);
            setEditBody(post.body);
        }
    }, [post]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        handleEditSubmit(post.id, editTitle, editBody);
        setIsEditing(false);
    }

    return (
        <main className="PostPage">
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
                                <button 
                                    onClick={handleSave} 
                                    style={{ background: '#007BFF', color: 'white' }}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <h2>{post.title}</h2>
                                <p className="postDate">{post.datetime}</p>
                                <p className="postBody">{post.body}</p>
                                <button onClick={() => handleDelete(post.id)}>
                                    Delete Post
                                </button>
                                <button
                                    style={{ background: '#FFD700', color: 'black', marginLeft: '15px' }}
                                    onClick={handleEdit}
                                >
                                    Edit Post
                                </button>
                            </>
                        )}
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
}

export default PostPage;
