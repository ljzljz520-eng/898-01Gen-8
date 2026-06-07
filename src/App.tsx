import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail';
import CreatePost from '@/pages/CreatePost';
import CarIndex from '@/pages/CarIndex';
import CarModelDetail from '@/pages/CarModelDetail';
import Profile from '@/pages/Profile';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';

export default function App() {
  const { initUsers } = useUserStore();
  const { initData } = usePostStore();

  useEffect(() => {
    initUsers();
    initData();
  }, [initUsers, initData]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/index" element={<CarIndex />} />
          <Route path="/index/:brand/:model" element={<CarModelDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
