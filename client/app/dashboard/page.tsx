"use client";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import {
  BsCamera,
  BsPeople,
  BsCart3,
  BsBell,
  BsImage,
  BsCameraVideo
} from 'react-icons/bs';
import { useRef } from 'react';

const DashboardPage = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };


  const handleLogout = () => {
    router.push('/');
  };
  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      alert("Please log in to create a post");
      router.push('/'); // Redirect to login
      return;
    }

    const userData = JSON.parse(userDataString);

    const postData = {
      user_id: userData.id, // Use the actual user ID from storage
      post: postContent,
      image: selectedImages.length > 0 ? selectedImages[0] : null,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/createpost", postData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Post created successfully!");
        setPostContent("");
        setSelectedImages([]);
        setIsModalOpen(false);
        const updatedPosts = await axios.get("http://localhost:8080/api/getAllPost", {
          withCredentials: true
        });
        setPosts(updatedPosts.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to create post";
        alert(errorMessage);
      } else {
        console.error("Error creating post:", error);
        alert("An error occurred while creating the post.");
      }
    }
  };
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imagePromises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(images => {
        setSelectedImages(images);
      });
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/getAllPost", {
          withCredentials: true
        });
        console.log('Posts response:', response.data); // Debug the response
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  {/* 
        <div className="absolute left-[26%] right-[25%] top-20">
          <div className={`w-[98%]  */}

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>

      <div className={`absolute left-1/4 top-0 bottom-0 w-[1px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`} />

      <div className={`absolute left-3/4 top-0 bottom-0 w-[1px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`} />
      <div className="absolute left-[26%] right-[25%] top-20">
        <div className={`w-[98%] p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            
            <input
              type="text"
              placeholder="What's on your mind !"
              onClick={() => setIsModalOpen(true)}
              readOnly
              className={`flex-1 p-2 rounded-md border ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        
        {posts.map((post) => (
          <div key={post.id} className={`w-[98%] p-6 rounded-lg shadow-md mt-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {`${post.name || ''} ${post.middle || ''} ${post.lastname || ''}`}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(post.created_at).toLocaleString()}
                </p>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {post.post}
                </p>
                
                {post.image && (
                  <div className="mt-4">
                    <img 
                      src={post.image}
                      alt="Post content" 
                      className="rounded-lg max-h-96 w-auto"
                    />
                  </div>
                )}
                
                <div className="flex space-x-4 mt-4">
                  <button className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Like</span>
                  </button>
                  
                  <button className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comment</span>
                  </button>
                  
                  <button className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}




        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-lg p-6 w-[45%] h-[65%] shadow-xl`}>
              <div className="flex justify-between items-center mb-4">
              </div>

              <div className="space-y-6 h-full flex flex-col">
                <div className="flex-1">
                  <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                  </label>

                  <div className={`w-full h-[95%] p-3 rounded-md border ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto`}>
                    <textarea
                      className={`w-full resize-none bg-transparent border-none focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      placeholder="Create your Post"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                    {selectedImages.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Selected ${index + 1}`}
                              className="h-32 w-full object-cover rounded-md"
                            />
                            <button
                              onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>



                  <div className={`flex items-center gap-4 mt-2 p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    <button className="flex items-center gap-2 hover:opacity-80" onClick={handleImageClick} >
                      <BsImage className="w-5 h-5" />
                      <span className="text-sm">Photo</span>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      multiple
                    />
                    <button className="flex items-center gap-2 hover:opacity-80">
                      <BsCameraVideo className="w-5 h-5" />
                      <span className="text-sm">Video</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-md ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Cancel
                  </button>
                  <button onClick={handlePostSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg relative z-10`}>
        <div className="w-full px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold pl-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Home
              </h1>
            </div>

            <div className="flex items-center justify-center flex-1 space-x-[8%]">
              <button
                className={`p-2 rounded-lg ${theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                aria-label="Videos"
              >
                <BsCamera className="w-6 h-6" />
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                aria-label="Friend Requests"
              >
                <BsPeople className="w-6 h-6" />
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                aria-label="Marketplace"
              >
                <BsCart3 className="w-6 h-6" />
              </button>
              <button
                className={`p-2 rounded-lg ${theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                aria-label="Notifications"
              >
                <BsBell className="w-6 h-6" />
              </button>
            </div>

            {/* Right side - Theme toggle and Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark'
                    ? 'hover:bg-gray-700 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <FiSun className="w-6 h-6" />
                ) : (
                  <FiMoon className="w-6 h-6" />
                )}
              </button>
              <div className="relative pr-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-2 rounded-full ${theme === 'dark'
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                    } focus:outline-none`}
                >
                  <FiSettings className="w-6 h-6" />
                </button>

                {isDropdownOpen && (
                  <div className={`absolute right-1 mt-2 w-48 rounded-md shadow-lg py-1 z-10 
                    ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <a
                      href="/dashboard/profile"
                      className={`block px-4 py-2 text-sm ${theme === 'dark'
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark'
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;