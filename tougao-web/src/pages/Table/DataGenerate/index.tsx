import React, { useState } from 'react';
import { Card, Button, message, Input, Image, Spin, Form, Select } from 'antd';
import { startTrainingModel3A } from '@/api/train'; // 从 API 中导入 startTrainingModel3A
import './index.less';

const { Option } = Select;

const DataGenerate: React.FC<{ files: Array<{ name: string }> }> = ({ files }) => { // 接收上传的文件列表
    const [learningRate, setLearningRate] = useState<number>(0.0002); // 学习率
    const [decayRate, setDecayRate] = useState<number>(0.5); // 衰减率
    const [epochs, setEpochs] = useState<number>(5000); // 训练轮数
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
    const [images, setImages] = useState<{ trainLossImg: string; trainAccImg: string, lossCurveImg: string }>({ trainLossImg: '', trainAccImg: '', lossCurveImg: '' });
    const [loadingImages, setLoadingImages] = useState<boolean>(false); // 控制图像加载状态
    const [selectedFile, setSelectedFile] = useState<number | null>(null); // 选择的文件索引

    // 开始训练
    const startTraining = async () => {
        setIsTraining(true);
        setTrainingComplete(false);
        setImages({ trainLossImg: '', trainAccImg: '', lossCurveImg: '' }); // 重置图像

        // 构造训练参数并发送请求
        const params = {
            learningRate,
            decayRate,
            epochs,
            // 传递选中的文件名
            selectedFile: selectedFile !== null ? files[selectedFile].name : null
        };

        try {
            // 发送训练请求
            const response = await startTrainingModel3A(params);

            if (response) {
                // 成功请求后，更新图像路径
                const realImagePath = `http://127.0.0.1:5000/${response.realImagePath}`;
                const generatedImagePath = `http://127.0.0.1:5000/${response.generatedImagePath}`;
                const lossCurvePath = `http://127.0.0.1:5000/${response.lossCurvePath}`;

                setImages({
                    trainLossImg: realImagePath,
                    trainAccImg: generatedImagePath,
                    lossCurveImg: lossCurvePath,
                });

                message.success('训练已完成，图像已生成');
            } else {
                throw new Error('训练接口未返回预期结果');
            }
        } catch (error) {
            message.error(`训练请求发送失败`);
        } finally {
            setIsTraining(false);
            setTrainingComplete(true);
            setLoadingImages(false); // 取消加载状态
        }
    };

    return (
        <>
            <Card title="数据生成模型训练" bordered={false} style={{ marginBottom: '20px' }}>
                <Form style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40 }}>
                    <div className="form-item">
                        <label className="form-item-label">选择数据文件</label>
                        <Select
                            style={{ width: 200 }}
                            onChange={value => setSelectedFile(value)}
                            placeholder="选择数据文件"
                        >
                            {files.map((file, index) => (
                                <Option key={index} value={index}>
                                    {file.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label className="form-item-label">学习率</label>
                        <Input
                            type="number"
                            value={learningRate}
                            onChange={e => setLearningRate(parseFloat(e.target.value))}
                            placeholder="输入学习率"
                        />
                    </div>
                    <div className="form-item">
                        <label className="form-item-label">衰减率:</label>
                        <Input
                            type="number"
                            value={decayRate}
                            onChange={(e) => setDecayRate(parseFloat(e.target.value))}
                            step="0.001"
                        />
                    </div>
                    <div className="form-item">
                        <label className="form-item-label">训练轮次</label>
                        <Input
                            type="number"
                            value={epochs}
                            onChange={e => setEpochs(parseInt(e.target.value))}
                            placeholder="输入训练轮次"
                        />
                    </div>
                </Form>

                <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 20 }}>
                    <Button
                        type={trainingComplete ? 'default' : 'primary'}
                        onClick={startTraining}
                        disabled={isTraining || selectedFile === null} // 当未选择文件时禁用按钮
                        style={{ width: '200px', padding: '10px' }}
                    >
                        {isTraining ? '模型训练中...' : '开始训练'}
                    </Button>
                </div>
            </Card>

            {trainingComplete && (
                <Card title="训练结果" bordered={false} style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        {loadingImages ? (
                            <Spin size="large" /> // 加载状态
                        ) : (
                            <>
                                {images.trainLossImg && (
                                    <Image
                                        src={images.trainLossImg}
                                        alt="真实数据图"
                                        style={{ margin: '0 10px' }} // 控制边距
                                    />
                                )}
                                {images.trainAccImg && (
                                    <Image
                                        src={images.trainAccImg}
                                        alt="生成数据图"
                                        style={{ margin: '0 10px' }} // 控制边距
                                    />
                                )}
                                {images.lossCurveImg && (
                                    <Image
                                        src={images.lossCurveImg}
                                        alt="损失曲线图"
                                        style={{ margin: '0 10px' }} // 控制边距
                                    />
                                )}
                            </>
                        )}
                    </div>
                </Card>
            )}
        </>
    );
};

export default DataGenerate;
