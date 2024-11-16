import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Form, Input, message, Modal, Typography } from 'antd';
import useGlobalModel from '@/models/global';  // 引入全局状态模型

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const { currentUser } = useGlobalModel();  // 获取当前用户信息（用户名、角色）
    const [userInfo, setUserInfo] = useState({
        name: currentUser.name,
        role: currentUser.role,
        gender: '',
        education: '',
        major: ''
    });

    const [profileForm] = Form.useForm();  // 用于更新个人资料的表单
    const [passwordForm] = Form.useForm();  // 用于密码更新的表单
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);  // 控制密码弹窗的显示

    // 获取用户详细信息
    useEffect(() => {
        if (currentUser) {
            fetch(`http://127.0.0.1:5000/api/user/details?username=${currentUser.name}&role=${currentUser.role}`)
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        message.error(data.message);
                    } else {
                        setUserInfo(data);  // 设置返回的用户数据
                    }
                })
                .catch(error => {
                    message.error('获取用户详情失败');
                });
        }
    }, [currentUser]);

    // 动态更新表单字段
    useEffect(() => {
        if (userInfo) {
            profileForm.setFieldsValue(userInfo);  // 设置表单的字段值
        }
    }, [userInfo, profileForm]);

    const handleProfileSubmit = (values: any) => {
        // 提交更新的资料，只更新 education 和 major
        const { education, major } = values;
        fetch('http://127.0.0.1:5000/api/user/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currentUser.name,
                role: currentUser.role,
                education,
                major,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    message.success(data.message);
                } else {
                    message.error('更新失败');
                }
            })
            .catch(error => {
                message.error('更新失败');
            });
    };

    const handlePasswordSubmit = async (values: any) => {
        // 提交密码更新
        const { currentPassword, newPassword } = values;

        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/update_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: currentUser.name,  // 使用当前登录用户的用户名
                    role: currentUser.role,      // 使用当前用户角色
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                message.success('密码更新成功');
                passwordForm.resetFields();  // 重置密码表单
                setIsPasswordModalVisible(false);  // 关闭密码修改弹窗
            } else {
                message.error(result.message || '密码更新失败');
            }
        } catch (error) {
            message.error('密码更新失败，请稍后重试');
        }
    };

    const handlePasswordModalOpen = () => {
        setIsPasswordModalVisible(true);
    };

    const handlePasswordModalClose = () => {
        setIsPasswordModalVisible(false);
    };

    return (
        <div style={{ padding: '30px' }}>
            <Title level={2}>个人中心</Title>

            <Card bordered={false} style={{ width: '100%', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>

                <Form
                    form={profileForm}
                    name="profile"
                    onFinish={handleProfileSubmit}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="姓名" name="name">
                                <Input disabled placeholder="姓名" style={{ backgroundColor: '#f0f2f5' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="身份" name="role">
                                <Input disabled placeholder="身份" style={{ backgroundColor: '#f0f2f5' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="性别" name="gender">
                                <Input disabled placeholder="性别" style={{ backgroundColor: '#f0f2f5' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="学历" name="education">
                                <Input placeholder="请输入学历" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="专业" name="major">
                                <Input placeholder="请输入专业" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '20px', width: '160px' }}>
                            更新资料
                        </Button>
                        <Button type="default" onClick={handlePasswordModalOpen} style={{ width: '160px' }}>
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* 修改密码模态框 */}
            <Modal
                title="修改密码"
                visible={isPasswordModalVisible}
                onCancel={handlePasswordModalClose}
                footer={null}
                bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Form
                    form={passwordForm}
                    name="changePassword"
                    onFinish={handlePasswordSubmit}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Row gutter={24} justify="center">
                        <Col span={24}>
                            <Form.Item
                                label="当前密码"
                                name="currentPassword"
                                rules={[{ required: true, message: '请输入当前密码' }]}
                            >
                                <Input.Password placeholder="请输入当前密码" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24} justify="center">
                        <Col span={24}>
                            <Form.Item
                                label="新密码"
                                name="newPassword"
                                rules={[{ required: true, message: '请输入新密码' }]}
                            >
                                <Input.Password placeholder="请输入新密码" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24} justify="center">
                        <Col span={24}>
                            <Form.Item
                                label="确认密码"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: '请确认新密码' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="确认新密码" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ width: '160px' }}>
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
