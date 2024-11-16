import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Row, Col, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';

const PostPaper: React.FC = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<RcFile[]>([]);

    // 处理文件选择变化
    const handleFileChange = (info: any) => {
        const { fileList } = info;
        setFileList(fileList);
    };

    // 提交表单
    const handleSubmit = (values: any) => {
        if (fileList.length === 0) {
            message.error('请上传论文稿件');
            return;
        }

        const { title, authors, affiliation, abstract, keywords } = values;
        const file = fileList[0].originFileObj;

        // 构建 FormData 数据
        const formData = new FormData();
        formData.append('title', title);
        formData.append('authors', authors);
        formData.append('affiliation', affiliation);
        formData.append('abstract', abstract);
        formData.append('keywords', keywords);
        formData.append('file', file);

        // 发送请求到后台
        fetch('http://127.0.0.1:5000/api/member/post-paper', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    message.success('提交成功');
                    form.resetFields(); // 清空表单
                    setFileList([]); // 清空文件列表
                } else {
                    message.error(data.message || '提交失败');
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                message.error('提交请求失败');
            });
    };

    // 上传文件属性配置
    const uploadProps = {
        beforeUpload: (file: RcFile) => {
            const isWordDoc = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword';
            if (!isWordDoc) {
                message.error('请上传 Word 文档');
            }
            return isWordDoc;
        },
        onChange: handleFileChange,
        fileList,
        showUploadList: {
            showRemoveIcon: true,
        },
    };

    return (
        <div style={{ padding: '20px 20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center">
                <Col xs={24} sm={22} md={18} lg={14}>
                    <Card
                        title="在线投稿"
                        bordered={false}
                        style={{
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            backgroundColor: '#fff',
                            padding: '40px',
                            minHeight: '600px',
                        }}
                    >
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                            initialValues={{
                                title: '',
                                authors: '',
                                affiliation: '',
                                abstract: '',
                                keywords: '',
                            }}
                        >
                            {/* 论文题目 */}
                            <Form.Item
                                label="论文题目"
                                name="title"
                                rules={[{ required: true, message: '请输入论文题目' }]}
                            >
                                <Input placeholder="请输入论文题目" size="large" />
                            </Form.Item>

                            {/* 作者 */}
                            <Form.Item
                                label="作者"
                                name="authors"
                                rules={[{ required: true, message: '请输入作者' }]}
                            >
                                <Input placeholder="请输入作者（多个作者用逗号隔开）" size="large" />
                            </Form.Item>

                            {/* 作者单位 */}
                            <Form.Item
                                label="作者单位"
                                name="affiliation"
                                rules={[{ required: true, message: '请输入作者单位' }]}
                            >
                                <Input placeholder="请输入作者单位" size="large" />
                            </Form.Item>

                            {/* 摘要 */}
                            <Form.Item
                                label="摘要"
                                name="abstract"
                                rules={[{ required: true, message: '请输入摘要' }]}
                            >
                                <Input.TextArea placeholder="请输入论文摘要" rows={6} size="large" />
                            </Form.Item>

                            {/* 关键词 */}
                            <Form.Item
                                label="关键词"
                                name="keywords"
                                rules={[{ required: true, message: '请输入关键词' }]}
                            >
                                <Input placeholder="请输入关键词（多个关键词用逗号隔开）" size="large" />
                            </Form.Item>

                            {/* 稿件上传 */}
                            <Form.Item
                                label="稿件上传"
                                name="file"
                                rules={[{ required: true, message: '请上传论文稿件' }]}
                            >
                                <Upload
                                    {...uploadProps}
                                    accept=".doc,.docx"
                                    maxCount={1}
                                    showUploadList={{ showDownloadIcon: false }}
                                >
                                    <Button icon={<UploadOutlined />} size="large" style={{ width: '100%' }}>
                                        点击上传 Word 文档
                                    </Button>
                                </Upload>
                            </Form.Item>

                            {/* 提交按钮 */}
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        fontSize: '16px',
                                        backgroundColor: '#1890ff',
                                    }}
                                >
                                    提交论文
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PostPaper;
