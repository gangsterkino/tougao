// src/pages/home/index.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>欢迎访问我们的在线投稿系统</h2>
      <p>这里展示一些基本信息，比如最新的刊物、活动等。</p>
      <ul>
        <li>刊物介绍</li>
        <li>投稿须知</li>
      </ul>
    </div>
  );
};

export default Home;
