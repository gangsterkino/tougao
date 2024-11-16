// 在 pluginConfig.ts 或 config.ts 中

import { defineConfig } from '@umijs/max';

// 定义用户信息类型
interface CurrentUser {
  name: string;
  role: string;
}

// 定义配置类型
interface ConfigType {
  initialState: {
    currentUser: CurrentUser;  // 定义 currentUser 类型
  };
}

export default defineConfig({
  antd: {},
  model: {},
  request: {},

  // 路由配置
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: '登录页面',
      component: '@/pages/Login',
    },
    {
      path: '/register',
      name: '注册会员',
      component: '@/pages/Register',
    },
    {
      path: '/home',
      name: '主页',
      component: '@/pages/Home',
    },
    {
      path: '/about',
      name: '刊物介绍',
      component: '@/pages/About',
    },
    {
      path: '/guidelines',
      name: '投稿须知',
      component: '@/pages/Guidelines',
    },
    {
      path: '/member',
      name: '会员首页',
      routes: [
        { path: '/member/post-paper', component: '@/pages/Member/PostPaper', access: 'canSeeMember' },
        { path: '/member/profile', component: '@/pages/Member/Profile', access: 'canSeeMember' },
        { path: '/member/submissions', component: '@/pages/Member/Submissions', access: 'canSeeMember' },
      ],
      access: 'canSeeMember', // 权限判断
    },
    {
      path: '/editor',
      name: '编辑首页',
      routes: [
        { path: '/editor/profile', component: '@/pages/Editor/Profile', access: 'canSeeEditor' },

        { path: '/editor/review-paper', component: '@/pages/Editor/ReviewPaper', access: 'canSeeEditor' },
      ],
      access: 'canSeeEditor',
    },
    {
      path: '/admin',
      name: '管理员首页',
      routes: [
        { path: '/admin/manage-users', component: '@/pages/Admin/ManageUsers', access: 'canSeeAdmin' },
      ],
      access: 'canSeeAdmin',
    },
    {
      path: '*',
      component: '@/pages/NotFound',
    },
  ],

  // 配置初始状态
  initialState: {
    currentUser: {
      name: '',
      role: '',  // 初始角色为空字符串
    },
    loading: undefined,  // 可选的 loading 状态
  } as API.InitialState,  // 将 initialState 类型断言为 API.InitialState


  // 使用的请求库配置
  npmClient: 'yarn',
});
