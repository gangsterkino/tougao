// src/pages/about/index.tsx
import React from 'react';
import { Card, Row, Col, Typography, Divider, Badge } from 'antd';

const { Title, Text } = Typography;

// 假设这些数据是你展示的刊物数据，可以从后端或本地获取
const publications = [
    {
        name: 'Journal of the American Chemical Society',
        imageUrl: 'https://th.bing.com/th/id/OIP.nnKOI_pBRtbMSOR5OOE5sAHaJ1?rs=1&pid=ImgDetMain',  // 真实的期刊封面链接
        year: 2024,
        quarter: 'Q1',  // 分区信息
    },
    {
        name: 'Advanced Material',
        imageUrl: 'https://th.bing.com/th/id/OIP.vASxt-BUR-1ikC4uaBi65AHaJv?rs=1&pid=ImgDetMain',  // 真实的期刊封面链接
        year: 2023,
        quarter: 'Q2',
    },
    {
        name: 'nature nanotechology',
        imageUrl: 'https://img.zcool.cn/community/015bab57bd130f0000012e7e4b348a.jpg@1280w_1l_2o_100sh.jpg',  // 真实的期刊封面链接
        year: 2022,
        quarter: 'Q1',
    },
    {
        name: 'nature genitics',
        imageUrl: 'https://th.bing.com/th/id/OIP.HdUusMVScqSXrkwMdMvFFgHaJ1?rs=1&pid=ImgDetMain',  // 真实的期刊封面链接
        year: 2021,
        quarter: 'Q1',
    },
    {
        name: 'The Lancet',
        imageUrl: 'https://anglicanmainstream.org/wp-content/uploads/2021/10/The-Lancet.jpg',  // 真实的期刊封面链接
        year: 2021,
        quarter: 'Q1',
    },
    {
        name: 'Advanced Material',
        imageUrl: 'https://th.bing.com/th/id/OIP.vASxt-BUR-1ikC4uaBi65AHaJv?rs=1&pid=ImgDetMain',  // 真实的期刊封面链接
        year: 2023,
        quarter: 'Q2',
    },
    {
        name: 'nature nanotechology',
        imageUrl: 'https://img.zcool.cn/community/015bab57bd130f0000012e7e4b348a.jpg@1280w_1l_2o_100sh.jpg',  // 真实的期刊封面链接
        year: 2022,
        quarter: 'Q1',
    },
    {
        name: 'Journal of the American Chemical Society',
        imageUrl: 'https://th.bing.com/th/id/OIP.nnKOI_pBRtbMSOR5OOE5sAHaJ1?rs=1&pid=ImgDetMain',  // 真实的期刊封面链接
        year: 2024,
        quarter: 'Q1',  // 分区信息
    },


];

const About: React.FC = () => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
            {/* 页面标题和描述 */}
            <Title level={1} style={{ textAlign: 'center', marginBottom: '20px' }}>
                刊物介绍
            </Title>
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: '40px', fontSize: '16px', color: '#555' }}>
                这里是关于我们刊物的介绍。我们发布的主题涵盖了很多领域，欢迎投稿。
            </Text>
            <Divider />

            {/* 展示刊物卡片 */}
            <Row gutter={[16, 24]} justify="center">
                {publications.map((publication, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>

                        <Card
                            hoverable
                            cover={<img alt={publication.name} src={publication.imageUrl} style={{ borderRadius: '8px' }} />}
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                marginBottom: '20px',
                            }}
                            bodyStyle={{
                                padding: '16px',
                                textAlign: 'center',
                                position: 'relative',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {/* 添加角标标志 */}

                            <Card.Meta
                                title={publication.name}
                                description={<span>出版年份: <strong>{publication.year}</strong></span>}
                            />
                            <Badge
                                count={publication.quarter}
                                style={{
                                    top: 10,
                                    backgroundColor: '#1890ff',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'fixed',
                                }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default About;
