import { history } from '@umijs/max';

export async function getInitialState() {
  try {
    // 获取存储的用户信息（可以是 role 信息）
    const storedUser = localStorage.getItem('currentUser');
    let currentUser = { name: 'Guest', role: '非会员' };

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }

    // 在获取到用户信息后进行权限验证
    checkPermissions(currentUser);

    return { currentUser };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return { currentUser: { name: 'Guest', role: '非会员' } };
  }
}

// 权限检查函数
function checkPermissions(currentUser) {
  // 获取当前的路径
  const currentPath = window.location.pathname;

  // 定义路由与权限角色的映射关系，使用前缀匹配
  const routeAccessMap = [
    { path: '/member', allowedRoles: ['会员'] },
    { path: '/editor', allowedRoles: ['编辑'] },
    { path: '/admin', allowedRoles: ['管理员'] },
    // 其他可以扩展的路径...
  ];

  // 判断当前路径是否匹配某个需要权限控制的路由
  for (let route of routeAccessMap) {
    // 如果当前路径以指定路径为前缀
    if (currentPath.startsWith(route.path)) {
      // 检查用户角色是否在允许的角色范围内
      if (!route.allowedRoles.includes(currentUser.role)) {
        // 如果没有权限，跳转到登录页面
        history.push('/login');
        return; // 跳出循环，避免继续检查其他路由
      }
    }
  }
}
