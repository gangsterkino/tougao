import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { message, Input, Button, Form, Select, Row, Col, Card } from 'antd';
import useGlobalModel from '@/models/global';  // 引入全局状态

const { Option } = Select;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('会员'); // 默认角色为会员
    const { updateUser, currentUser } = useGlobalModel();  // 获取当前用户信息和更新方法

    // 判断用户是否已经登录，role 为“非会员”表示未登录
    useEffect(() => {
        if (currentUser && currentUser.role !== '非会员') {
            console.log("Updated currentUser:", currentUser);
            // 如果已登录，根据角色跳转到不同页面
            if (currentUser.role === 'member') {
                history.push('/member/profile');
            } else if (currentUser.role === 'editor') {
                history.push('/editor');
            } else if (currentUser.role === 'admin') {
                history.push('/admin');
            }
        }
    }, [currentUser]);  // 只监听 currentUser 的变化

    const handleLogin = async () => {
        try {
            // 将前端的中文角色映射为后端的英文角色
            const roleMapping = {
                '会员': 'member',
                '编辑': 'editor',
                '管理员': 'admin',
            };
            const backendRole = roleMapping[role];  // 前端角色映射为后端角色

            // 调试，确保角色正确传递
            console.log("角色:", backendRole);

            const response = await fetch('http://127.0.0.1:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: backendRole,  // 后端角色字段需要标准化
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success(result.message);

                // 更新用户信息，直接使用返回的 username 和角色
                updateUser({
                    name: result.username,  // 使用返回的 username
                    role: backendRole,          // 使用发送给后端的角色（前端角色映射）
                });

                // 根据角色跳转到不同页面
                if (backendRole === 'member') {
                    history.push('/member/profile');
                } else if (backendRole === 'editor') {
                    history.push('/editor');
                } else if (backendRole === 'admin') {
                    history.push('/admin');
                }
            } else {
                message.error(result.message || '登录失败');
            }
        } catch (error) {
            message.error('登录失败，请稍后重试');
        }
    };

    const goToRegister = () => {
        history.push('/register');
    };

    return (
        <div style={{ padding: '50px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>

            <div style={{ justifyItems: 'center' }}><h1 >在线投稿系统</h1></div>
            {/* 登录卡片 */}
            <Row justify="center">

                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card
                        title="用户登录"
                        bordered={false}
                        style={{
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            padding: '30px',
                        }}
                    >
                        <Form layout="vertical">
                            {/* 用户名 */}
                            <Form.Item
                                label="用户名"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="请输入用户名"
                                />
                            </Form.Item>

                            {/* 密码 */}
                            <Form.Item
                                label="密码"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="请输入密码"
                                />
                            </Form.Item>

                            {/* 角色选择 */}
                            <Form.Item
                                label="选择角色"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Select
                                    value={role}
                                    onChange={(value) => setRole(value)}
                                    placeholder="请选择角色"
                                >
                                    <Option value="会员">会员</Option>
                                    <Option value="编辑">编辑</Option>
                                    <Option value="管理员">管理员</Option>
                                </Select>
                            </Form.Item>

                            {/* 登录按钮 */}
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    onClick={handleLogin}
                                    style={{

                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        marginRight: 40
                                    }}
                                >
                                    登录
                                </Button>
                                <Button
                                    onClick={goToRegister}
                                    style={{

                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    注册会员
                                </Button>
                            </Form.Item>


                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;
