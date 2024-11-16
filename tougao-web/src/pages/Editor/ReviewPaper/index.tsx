import React, { useState, useEffect } from 'react';
import { Table, Button, message, Spin, Input, Select, Typography, Row, Col, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useGlobalModel from '@/models/global';  // 引入全局状态模型

const { Option } = Select;
const { Title, Text } = Typography;

const ReviewPaper: React.FC = () => {
    const { currentUser } = useGlobalModel();  // 获取当前用户信息（用户名）
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titleFilter, setTitleFilter] = useState('');  // 书名过滤条件
    const [statusFilter, setStatusFilter] = useState('');  // 状态过滤条件

    // 映射英文状态到中文
    const statusTranslation = {
        SUBMITTED: '投稿',
        UNDER_REVIEW: '审稿中',
        REJECTED: '拒稿',
        ACCEPTED: '通过',
    };

    useEffect(() => {
        fetchPapers();  // 加载所有论文
    }, [titleFilter, statusFilter]);  // 每次过滤条件变化时重新查询

    const fetchPapers = () => {
        setLoading(true); // 开始加载
        fetch(`http://localhost:5000/api/member/get-papers?title=${titleFilter}&status=${statusFilter}`)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.length === 0) {
                    message.warning('没有符合条件的稿件');
                    setFilteredPapers([]);  // 没有数据时设置为空
                } else {
                    // 映射状态并设置数据
                    const mappedPapers = data.map(paper => ({
                        ...paper,
                        status: statusTranslation[paper.status] || paper.status,
                        editorName: paper.editor_name || '无', // 编辑姓名字段
                    }));
                    setFilteredPapers(mappedPapers); // 更新筛选后的论文数据
                }
            })
            .catch(error => {
                setLoading(false);
                message.error('获取数据失败: ' + error);
            });
    };

    // 状态选择变化时触发
    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    // 书名输入变化时触发
    const handleTitleChange = (e) => {
        setTitleFilter(e.target.value);
    };

    // 处理下载文件的功能
    const handleDownload = (filePath) => {
        const filename = filePath.split('/').pop();  // 获取文件名部分
        const fileUrl = `http://localhost:5000/api/editor/download/${filename}`;  // 使用后端提供的下载 API
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename; // 使用文件名为下载名
        link.click();  // 触发下载
    };

    // 状态颜色映射
    const getStatusColor = (status) => {
        switch (status) {
            case '投稿':
                return { color: '#fff', backgroundColor: '#ffa500' }; // Orange
            case '审稿中':
                return { color: '#fff', backgroundColor: '#1890ff' }; // Blue
            case '拒稿':
                return { color: '#fff', backgroundColor: '#ff4d4f' }; // Red
            case '通过':
                return { color: '#fff', backgroundColor: '#52c41a' }; // Green
            default:
                return { color: '#000', backgroundColor: '#f5f5f5' }; // Default
        }
    };

    const columns = [
        {
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            ellipsis: true, // 超长文本显示省略号
        },
        {
            title: '作者',
            dataIndex: 'authors',
            key: 'authors',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <span
                    style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        ...getStatusColor(status), // 根据状态设置颜色
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: '编辑姓名',
            dataIndex: 'editorName',
            key: 'editorName',
            align: 'center',
        },
        {
            title: '稿件',
            key: 'file',
            align: 'center',
            render: (text, record) => {
                return record.file_path ? (
                    <Button
                        type="link"
                        onClick={() => handleDownload(record.file_path)}
                    >
                        下载
                    </Button>
                ) : (
                    <Text type="secondary">无文件</Text>
                );
            },
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                // 如果状态是 "拒稿" 或 "通过"，则不显示操作按钮
                if (record.status === '拒稿' || record.status === '通过') {
                    return null;  // 不显示操作按钮
                }

                return (
                    <div>
                        {/* 当状态为"投稿"时，展示"审稿"按钮 */}
                        {record.status === '投稿' && (
                            <Button
                                onClick={() => handleReview(record.id)}
                                type="primary"
                                style={{ marginRight: 10 }}
                            >
                                审稿
                            </Button>
                        )}
                        {/* 当状态为"审稿中"时，展示"拒稿"和"通过"按钮 */}
                        {record.status === '审稿中' && (
                            <>
                                <Button
                                    onClick={() => handleReview(record.id, '拒稿')}
                                    type="primary"
                                    style={{ marginRight: 10, backgroundColor: 'red' }}
                                >
                                    拒稿
                                </Button>
                                <Button
                                    onClick={() => handleReview(record.id, '通过')}
                                    type="primary"
                                    style={{
                                        marginRight: 10, backgroundColor: '#52c41a'
                                    }}
                                >
                                    通过
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    // 审稿操作（包括拒稿、通过）
    const handleReview = (paperId, action = 'UNDER_REVIEW') => {
        const newStatus = action === 'UNDER_REVIEW' ? '审稿' : action;
        const editorName = currentUser.name;  // 获取当前用户的姓名

        const requestBody = {
            status: newStatus,
            editor_name: editorName,  // 传递 editor_name
        };

        fetch(`http://localhost:5000/api/editor/update-status/${paperId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                message.success(`${newStatus === 'REJECTED' ? '拒绝' : '通过'}成功`);
                fetchPapers();  // 刷新数据
            })
            .catch(error => {
                message.error('操作失败: ' + error);
            });
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7fa' }}>
            <Card
                title={<Title level={3}>审稿管理</Title>}
                bordered={false}
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fff',
                }}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <Input
                            placeholder="输入书名进行过滤"
                            value={titleFilter}
                            onChange={handleTitleChange}
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={12}>
                        <Select
                            placeholder="选择状态"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >

                            <Option value="">所有状态</Option>
                            <Option value="投稿">投稿</Option>
                            <Option value="审稿中">审稿中</Option>
                            <Option value="拒稿">拒稿</Option>
                            <Option value="通过">通过</Option>
                        </Select>
                    </Col>
                </Row>

                {/* 加载中显示Spinner */}
                {loading ? (
                    <Spin tip="加载中..." size="large" />
                ) : filteredPapers.length === 0 ? (
                    <Text type="secondary">没有符合条件的稿件</Text>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredPapers}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: true }}
                        bordered
                        size="middle"
                        style={{
                            marginTop: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                )}
            </Card>
        </div>
    );
};

export default ReviewPaper;
