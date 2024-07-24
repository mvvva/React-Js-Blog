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
  const [posts, setPosts] = useState([
    {
        id: 1,
        title: "My First Post",
        datetime: "July 01, 2021 11:17:36 AM",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
    },
    {
        id: 2,
        title: "My 2nd Post",
        datetime: "July 01, 2021 11:17:36 AM",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
    },
    {
        id: 3,
        title: "My 3rd Post",
        datetime: "July 01, 2021 11:17:36 AM",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
    },
    {
        id: 4,
        title: "My Fourth Post",
        datetime: "July 01, 2021 11:17:36 AM",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
    },
]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const filteredPosts = posts.filter((post) => {
            return (
                post.title.toUpperCase().includes(search.toUpperCase()) ||
                post.body.toUpperCase().includes(search.toUpperCase())
            );
        });

        setSearchResults(filteredPosts);
    }, [posts, search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), "MMMM dd, yyyy pp");
        const newPost = { id, title: postTitle, datetime, body: postBody };
        setPosts([...posts, newPost]);
        setPostTitle("");
        setPostBody("");
        navigate("/");
    };

    const handleDelete = (id) => {
        const deletedPost = posts.filter(post => post.id !== id);
        setPosts(deletedPost);
        navigate('/');
    };

    const handleEditSubmit = (id, updatedTitle, updatedBody) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, title: updatedTitle, body: updatedBody } : post
        );
        setPosts(updatedPosts);
    };

    return (
        <div className='App'>
            <Header title='React JS Blog' />
            <Nav search={search} setSearch={setSearch} />
            <Routes>
                <Route path='/' element={<Home posts={searchResults} />} />
                <Route
                    path='/post'
                    element={
                        <NewPost
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
