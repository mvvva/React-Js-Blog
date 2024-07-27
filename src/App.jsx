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

function App() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [deleting, setDeleting] = useState(false)
    const [creating, setCreating] = useState(false)
    const [editing, setEditing] = useState(false)
    const navigate = useNavigate();


    const base_url = import.meta.env.VITE_BASE_URL



    useEffect(() => {
        async function fetchPosts() {
            setFetching(true);
            setError(null);

            try {
                const response = await fetch(`${base_url}/posts`);
                if (!response.ok) {
                    throw new Error("Network response was not ok!");
                }
                const fetchedPosts = await response.json();
                setPosts(fetchedPosts);
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
        setCreating (true)
        const id = posts.length ? String(Number(posts[posts.length - 1].id) + 1) : 1;
        const datetime = format(new Date(), "MMMM dd, yyyy pp");
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
          const response = await fetch(`${base_url}/posts`, {
            method: 'POST',
            headers:{
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost)
          })
          const newPosts = [newPost, ...posts];
          setPosts(newPosts);

          setPostTitle("");
          setPostBody("");
          navigate("/");
          
        }finally{
          setCreating(false)
        }
        setPosts([...posts, newPost]);
        setPostTitle("");
        setPostBody("");
        navigate("/");
    };

    const handleDelete = async (id) => {
      setDeleting(true)
        try {
          const response = await fetch(`${base_url}/posts/${id}`,{
            method: 'DELETE'
          })
          const filteredPosts = posts.filter(post => post.id !== id)
          setPosts(filteredPosts);
        } catch (error) {
          
        }finally{
          setDeleting(false)
        }

        navigate('/');
    };

    const handleEditSubmit = async (id, updatedTitle, updatedBody) => {
      setEditing(true);
      try {
          const response = await fetch(`${base_url}/posts/${id}`, {
              method: 'PUT',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
          });
          if (!response.ok) {
              throw new Error("Network response was not ok!");
          }
          const updatedPost = { id, title: updatedTitle, body: updatedBody };
          const updatedPosts = posts.map(post =>
              post.id === id ? updatedPost : post
          );
          setPosts(updatedPosts);
          navigate('/');
      } catch (error) {
          console.error("Error updating post:", error.message);
      } finally {
          setEditing(false);
      }
  };
  

    return (
        <div className='App'>
            <Header title='React JS Blog' />
            <Nav search={search} setSearch={setSearch} />
            {fetching && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>Error: {error}</p>}
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
                            loading={editing}
                            posts={posts} 
                            handleDelete={handleDelete}
                            handleEditSubmit={handleEditSubmit}
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
