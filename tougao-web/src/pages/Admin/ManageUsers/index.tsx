import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Pagination, Card, Row, Col } from 'antd';
import axios from 'axios';
import useGlobalModel from '@/models/global';

const { Option } = Select;

const ManageUsers: React.FC = () => {
    const { currentUser } = useGlobalModel();
    const [users, setUsers] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<any>({ name: '', role: '' });
    const [editingUser, setEditingUser] = useState<any>(null); // 当前编辑的用户
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 是否显示 modal
    const [form] = Form.useForm(); // 表单实例

    // 获取用户列表
    const fetchUsers = async (page: number) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/admin/users', {
                params: {
                    ...queryParams,
                    page: page,
                    pageSize: 8, // 每页8个用户
                },
            });
            setUsers(response.data.users);
            setTotal(response.data.total); // 返回的总数
        } catch (error) {
            message.error('获取用户失败');
        }
    };

    useEffect(() => {
        fetchUsers(currentPage); // 初始化加载
    }, [queryParams, currentPage]);

    const showAddUserModal = () => {
        setEditingUser(null); // 重置编辑用户
        form.resetFields(); // 重置表单字段
        setIsModalVisible(true);
    };

    const showEditUserModal = (user: any) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            role: user.role,
            gender: user.gender,
            education: user.education,
            major: user.major,
            password: '',
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null); // 关闭时重置
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // 表单验证
            if (editingUser) {
                // 编辑用户
                await axios.put(`http://127.0.0.1:5000/api/admin/user/${editingUser.id}`, values);
                message.success('用户更新成功');
            } else {
                // 添加用户
                await axios.post('http://127.0.0.1:5000/api/admin/user', values);
                message.success('用户创建成功');
            }
            fetchUsers(currentPage); // 刷新用户列表
            setIsModalVisible(false); // 关闭模态框
        } catch (error) {
            message.error('保存用户失败');
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/admin/user/${userId}`);
            message.success('用户删除成功');
            fetchUsers(currentPage); // 删除后刷新列表
        } catch (error) {
            message.error('删除用户失败');
        }
    };

    const handleQueryChange = (field: string, value: string) => {
        setQueryParams((prevParams) => ({
            ...prevParams,
            [field]: value,
        }));
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchUsers(page); // 翻页时重新加载数据
    };

    // 角色映射
    const roleMap = {
        member: '会员',
        editor: '编辑',
        admin: '管理员',
    };

    // 性别选择映射
    const genderMap = {
        male: '男',
        female: '女',
    };

    const columns = [
        {
            title: '序号',
            render: (_: any, record: any, index: number) => index + 1,
            align: 'center',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            align: 'center',
        },
        {
            title: '角色',
            dataIndex: 'role',
            render: (text: string) => roleMap[text] || text, // 显示中文角色
            align: 'center',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            render: (text: string) => genderMap[text] || text, // 显示中文性别
            align: 'center',
        },
        {
            title: '学历',
            dataIndex: 'education',
            align: 'center',
        },
        {
            title: '专业',
            dataIndex: 'major',
            align: 'center',
        },
        {
            title: '操作',
            render: (_: any, record: any) => (
                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        onClick={() => showEditUserModal(record)}
                        style={{ marginRight: 8 }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="text"
                        danger
                        onClick={() => handleDelete(record.id)}
                        style={{ color: 'red', borderColor: 'red' }}
                    >
                        删除
                    </Button>
                </div>
            ),
            align: 'center',
        },
    ];

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9' }}>
            <Card
                title="用户管理"
                bordered={false}
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                }}
            >
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={8}>
                        <Form layout="inline" style={{ width: '100%' }}>
                            <Form.Item label="用户名">
                                <Input
                                    value={queryParams.name}
                                    onChange={(e) => handleQueryChange('name', e.target.value)}
                                    placeholder="请输入用户名"
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="角色">
                                <Select
                                    value={queryParams.role}
                                    onChange={(value) => handleQueryChange('role', value)}
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                    allowClear
                                >
                                    <Option value="member">会员</Option>
                                    <Option value="editor">编辑</Option>
                                    <Option value="admin">管理员</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            onClick={showAddUserModal}
                            style={{
                                borderRadius: '6px',
                                fontSize: '14px',
                                padding: '0 20px',
                            }}
                        >
                            添加用户
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={false}
                    style={{ marginBottom: '20px' }}
                />

                <Pagination
                    current={currentPage}
                    pageSize={8}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    style={{ textAlign: 'center' }}
                />
            </Card>

            <Modal
                title={editingUser ? '编辑用户' : '添加用户'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose
                width={600}
                bodyStyle={{
                    padding: '20px',
                }}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[{ required: true, message: '请选择角色!' }]}
                        style={{ width: '150px' }} // 设置 Form.Item 的宽度
                    >
                        <Select style={{ width: '150px' }}> {/* Select 宽度设置为 100%，使其填充 Form.Item */}
                            <Option value="member">会员</Option>
                            <Option value="editor">编辑</Option>
                            <Option value="admin">管理员</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[{ required: true, message: '请选择性别!' }]}
                    >
                        <Select>
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="学历"
                        name="education"
                        rules={[{ required: true, message: '请输入学历!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="专业"
                        name="major"
                        rules={[{ required: true, message: '请输入专业!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageUsers;
