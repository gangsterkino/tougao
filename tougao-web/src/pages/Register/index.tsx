import React, { useState } from 'react';
import { message, Input, Button, Form, Select, Row, Col, Card } from 'antd';
import { history } from 'umi';

const { Option } = Select;

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [education, setEducation] = useState('');
    const [major, setMajor] = useState(''); // 将 degree 改为 major
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        // 简单表单验证
        if (!username || !gender || !education || !major || !password) { // 将 degree 改为 major
            message.error('请填写所有必填项');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,  // 将 name 改为 username
                    password,
                    role: 'member', // 注册固定为会员
                    gender,
                    education,
                    major, // 将 degree 改为 major
                }),
            });
            const result = await response.json();
            if (response.ok) {
                message.success(result.message);
                history.push('/login');
            } else {
                message.error(result.error);
            }
        } catch (error) {
            message.error('注册失败，请稍后重试');
        }
    };

    return (
        <div style={{ padding: '50px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
            <div style={{ justifyItems: 'center' }}><h1 >在线投稿系统</h1></div>
            <Row justify="center">

                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card
                        title="用户注册"
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

                            {/* 性别 */}
                            <Form.Item
                                label="性别"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Select
                                    value={gender}
                                    onChange={(value) => setGender(value)}
                                    placeholder="请选择性别"
                                >
                                    <Option value="">请选择</Option>
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>

                                </Select>
                            </Form.Item>

                            {/* 学历 */}
                            <Form.Item
                                label="学历"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    placeholder="请输入学历"
                                />
                            </Form.Item>

                            {/* 专业 */}
                            <Form.Item
                                label="专业"
                                required
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    placeholder="请输入专业"
                                />
                            </Form.Item>

                            {/* 密码 */}
                            <Form.Item
                                label="密码"
                                required
                                style={{ marginBottom: '30px' }}
                            >
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="请输入密码"
                                />
                            </Form.Item>

                            {/* 注册按钮 */}
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    onClick={handleRegister}
                                    style={{

                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                    }}
                                >
                                    注册
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;
