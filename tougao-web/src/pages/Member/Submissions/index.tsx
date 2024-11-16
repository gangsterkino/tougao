import React, { useState, useEffect } from 'react';
import { Table, Button, message, Spin, Input, Select, Row, Col, Card, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SubmissionQuery = () => {
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titleFilter, setTitleFilter] = useState(''); // 书名过滤条件
    const [statusFilter, setStatusFilter] = useState(''); // 状态过滤条件

    // 映射英文状态到中文
    const statusTranslation = {
        SUBMITTED: '投稿',
        UNDER_REVIEW: '审稿中',
        REJECTED: '拒稿',
        ACCEPTED: '通过',
    };

    useEffect(() => {
        fetchPapers(); // 加载所有论文
    }, [titleFilter, statusFilter]); // 每次过滤条件变化时重新查询

    const fetchPapers = () => {
        setLoading(true); // 开始加载
        // 调试：查看传递给后台的参数
        console.log('请求参数:', { titleFilter, statusFilter });

        // 请求后台数据，传递过滤条件
        fetch(`http://localhost:5000/api/member/get-papers?title=${titleFilter}&status=${statusFilter}`)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.length === 0) {
                    message.warning('没有符合条件的稿件');
                    setFilteredPapers([]); // 没有数据时设置为空
                } else {
                    // 映射状态并设置数据
                    const mappedPapers = data.map(paper => ({
                        ...paper,
                        status: statusTranslation[paper.status] || paper.status,
                        editorName: paper.editor_name || '无' // 处理编辑姓名字段，默认为 "无"
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

    const columns = [
        {
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
            width: 450,
            align: 'center',  // 设置内容居中对齐

            render: (text) => <span style={{ color: '#2f54eb', fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: '作者',
            dataIndex: 'authors',
            align: 'center',  // 设置内容居中对齐

            key: 'authors',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',  // 设置内容居中对齐

            render: (status) => (
                <span style={{ color: getStatusColor(status) }}>{status}</span>
            ),
        },
        {
            title: '编辑姓名',
            dataIndex: 'editorName',
            align: 'center',  // 设置内容居中对齐

            key: 'editorName', // 显示编辑姓名列
        },
    ];

    // 状态颜色映射
    const getStatusColor = (status) => {
        switch (status) {
            case '投稿':
                return 'orange';
            case '审稿中':
                return 'blue';
            case '拒稿':
                return 'red';
            case '通过':
                return 'green';
            default:
                return 'black';
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
            <Card
                title="查询所有稿件"
                bordered={false}
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '30px',
                    backgroundColor: '#fff',
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="输入书名进行过滤"
                            value={titleFilter}
                            onChange={handleTitleChange}
                            style={{
                                width: '50%',

                                borderRadius: '8px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            prefix={<SearchOutlined />}
                        />
                    </Col>

                    <Col xs={24} md={12}>
                        <Select
                            placeholder="选择状态"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            style={{
                                width: '20%',
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

                <div style={{ marginTop: '20px' }}>
                    {/* 加载中显示Skeleton */}
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 6 }} />
                    ) : filteredPapers.length === 0 ? (
                        <div style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>
                            没有符合条件的稿件
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredPapers}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            style={{
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SubmissionQuery;
