// src/pages/guidelines/index.tsx
import React from 'react';
import { Card, Row, Col, Typography, Button, List, Divider, Space, Tag } from 'antd';
import { DownloadOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Guidelines: React.FC = () => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
            {/* 页面标题和描述 */}
            <Title level={1} style={{ textAlign: 'center', marginBottom: '20px' }}>
                投稿须知
            </Title>
            <Paragraph style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>
                欢迎阅读我们的投稿须知，了解详细的投稿要求和注意事项。请确保您的稿件符合以下标准，
                以便顺利通过审稿流程。
            </Paragraph>
            <Divider />

            {/* 详细要求部分 */}
            <Row gutter={24} justify="center" style={{ marginBottom: '40px' }}>
                {/* 第一部分：稿件格式 */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                        title="稿件格式"
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        extra={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    >
                        <List
                            bordered
                            dataSource={[
                                'Word文档 (.docx)',
                                '字体要求：宋体，正文小四号，行距1.5倍',
                                '摘要和关键词请分别单独列出',
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Card>
                </Col>

                {/* 第二部分：作者要求 */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                        title="作者要求"
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        extra={<EditOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    >
                        <List
                            bordered
                            dataSource={[
                                '请提供所有作者的姓名和单位',
                                '联系方式：请提供有效的电话和邮箱地址',
                                '如有资金支持，需注明资助来源',
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Card>
                </Col>

                {/* 第三部分：注意事项 */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                        title="注意事项"
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        extra={<Tag color="orange">重要</Tag>}
                    >
                        <List
                            bordered
                            dataSource={[
                                '请确保稿件为原创作品，未在其他刊物上发布',
                                '每篇论文只能提交一个版本，重复提交将被取消评审资格',
                                '根据评审意见修改后重新提交时，需附上修改说明',
                            ]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 下载和链接部分 */}
            <div style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="large"
                        href="https://example.com/guide.pdf"
                        target="_blank"
                    >
                        下载完整投稿指南
                    </Button>
                    <Text strong>
                        <a href="#details" style={{ color: '#1890ff' }}>
                            查看详细的投稿流程
                        </a>
                    </Text>
                </Space>
            </div>
        </div>
    );
};

export default Guidelines;
