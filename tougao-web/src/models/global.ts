// src/models/global.ts
import { useState, useEffect } from 'react';

// 定义用户信息的类型
export interface CurrentUser {
  name: string;
  role: string;
}

// 默认的用户信息
const DEFAULT_USER: CurrentUser = {
  name: 'Guest',
  role: '非会员',
};

const useGlobalModel = () => {
  // 从 localStorage 或 sessionStorage 中获取保存的用户信息
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : DEFAULT_USER;

  // 使用初始用户信息
  const [currentUser, setCurrentUser] = useState<CurrentUser>(initialUser);

  const updateUser = (user: CurrentUser) => {
    // 更新用户信息并保存到 localStorage
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // 持久化用户信息
  };

  // 退出登录功能：清空用户信息
  const logout = () => {
    setCurrentUser(DEFAULT_USER);  // 将用户信息重置为默认值
    localStorage.removeItem('currentUser');  // 清除存储的用户信息
  };

  // 监听 currentUser 变化（如果需要在用户变化时执行某些副作用）
  useEffect(() => {
    console.log('currentUser updated:', currentUser);
  }, [currentUser]);

  return {
    currentUser, // 当前用户信息
    updateUser,  // 更新用户信息
    logout,      // 退出登录
  };
};

export default useGlobalModel;
