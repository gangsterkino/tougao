import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from 'umi';
import { useModel } from '@umijs/max';
import {
    DollarOutlined,
    SyncOutlined,
    DatabaseOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FileTextOutlined,
    EditOutlined,
    UsergroupAddOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
}

// 角色英文到中文的映射
const roleMap: { [key: string]: string } = {
    member: '会员',
    editor: '编辑',
    admin: '管理员',
};

const CustomLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('1');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    // 获取当前用户的模型
    const { currentUser, logout } = useModel('global') || { currentUser: { role: 'non-member', name: 'Guest' }, logout: () => { } };

    const navigate = useNavigate();
    const location = useLocation();

    // 检查是否是登录页面
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    // 转换角色为中文
    const currentRole = roleMap[currentUser.role] || '非会员'; // 默认角色为“非会员”

    // 根据 currentUser 的 role 动态生成菜单项
    useEffect(() => {
        if (currentUser) {
            const items: MenuItem[] = [
                { key: '1', icon: <FileTextOutlined />, label: <Link to="/about">刊物介绍</Link> },
                { key: '2', icon: <FileTextOutlined />, label: <Link to="/guidelines">投稿须知</Link> },
            ];

            // 根据角色动态生成菜单
            switch (currentUser.role) {
                case 'member':
                    items.push(
                        { key: '3', icon: <UserOutlined />, label: <Link to="/member/profile">个人中心</Link> },
                        { key: '4', icon: <FileTextOutlined />, label: <Link to="/member/post-paper">在线投稿</Link> },
                        { key: '5', icon: <DatabaseOutlined />, label: <Link to="/member/submissions">查询稿件</Link> }
                    );
                    break;
                case 'editor':
                    items.push(
                        { key: '6', icon: <UserOutlined />, label: <Link to="/editor/profile">个人中心</Link> },
                        { key: '7', icon: <EditOutlined />, label: <Link to="/editor/review-paper">审稿</Link> }
                    );
                    break;
                case 'admin':
                    items.push({ key: '8', icon: <UsergroupAddOutlined />, label: <Link to="/admin/manage-users">用户管理</Link> });
                    break;
                default:
                    break;
            }

            // 更新菜单项
            setMenuItems(items);
        }
    }, [currentUser]); // 依赖 currentUser，当用户信息变化时重新生成菜单

    const handleClick = (e: any) => setCurrent(e.key);

    const toggleCollapsed = () => setCollapsed(!collapsed);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> 退出登录
            </Menu.Item>
        </Menu>
    );

    if (isLoginPage || isRegisterPage) {
        return <Outlet />;
    }

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Sider
                width={300}
                collapsed={collapsed}
                style={{ backgroundColor: '#fff', position: 'fixed', height: '100vh', zIndex: 1 }}
            >
                <div style={{ padding: '20px', fontSize: '18px', color: '#000', textAlign: 'center' }}>
                    <h1>在线投稿系统</h1>
                </div>
                <div style={{ padding: '20px', fontSize: '18px', color: '#000', textAlign: 'center' }}>
                    {currentUser ? `${currentUser.name} (${currentRole})` : ''}
                </div>

                {currentUser && (
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <div style={{ padding: '10px', textAlign: 'center' }}>
                            <Avatar size={40} icon={<UserOutlined />} />
                        </div>
                    </Dropdown>
                )}

                <Menu onClick={handleClick} selectedKeys={[current]} mode="inline" style={{ border: 'none' }}>
                    {menuItems.map((item) => (
                        <Menu.Item key={item.key} icon={item.icon}>
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu>

                <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
                    {collapsed ? (
                        <MenuUnfoldOutlined onClick={toggleCollapsed} style={{ cursor: 'pointer', fontSize: '18px' }} />
                    ) : (
                        <MenuFoldOutlined onClick={toggleCollapsed} style={{ cursor: 'pointer', fontSize: '18px' }} />
                    )}
                </div>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 300 }}>
                <Content style={{ padding: '20px', overflowY: 'auto', backgroundColor: '#f0f0f0', color: '#000', minHeight: '100vh' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default CustomLayout;
