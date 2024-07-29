import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

function App() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const base_url = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        async function fetchPosts() {
            setFetching(true);
            setError(null);

            try {
                const response = await axios.get(`${base_url}/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error(error.message);
                setError("Error fetching posts: " + error.message);
            } finally {
                setFetching(false);
            }
        }

        fetchPosts();
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            const filteredPosts = posts.filter((post) => {
                return (
                    post.title.toUpperCase().includes(search.toUpperCase()) ||
                    post.body.toUpperCase().includes(search.toUpperCase())
                );
            });
            setSearchResults(filteredPosts);
        }
    }, [posts, search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        const id = posts.length ? String(Number(posts[posts.length - 1].id) + 1) : 1;
        const datetime = format(new Date(), "MMMM dd, yyyy pp");
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
            const response = await axios.post(`${base_url}/posts`, newPost);
            setPosts([response.data, ...posts]);
            setPostTitle("");
            setPostBody("");
            navigate("/");
        } catch (error) {
            console.error("Error creating post:", error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${base_url}/posts/${id}`);
            const filteredPosts = posts.filter(post => post.id !== id);
            setPosts(filteredPosts);
            navigate('/');
        } catch (error) {
            console.error("Error deleting post:", error.message);
            setError("Error deleting post: " + error.message);
        }
    };

    return (
        <div className='App'>
            <Header title='React JS Blog' />
            <Nav search={search} setSearch={setSearch} />
            {fetching && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            <Routes>
                <Route path='/' element={<Home posts={searchResults} />} />
                <Route
                    path='/post'
                    element={
                        <NewPost
                            loading={creating}
                            handleSubmit={handleSubmit}
                            postTitle={postTitle}
                            setPostTitle={setPostTitle}
                            postBody={postBody}
                            setPostBody={setPostBody}
                        />
                    }
                />
                <Route
                    path='/post/:id'
                    element={
                        <PostPage
                            setPosts={setPosts}
                            posts={posts}
                            handleDelete={handleDelete}
                        />
                    }
                />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<Missing />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
