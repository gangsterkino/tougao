import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Typography, message } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, registerables } from 'chart.js';
import './index.less';
import { startTrainingModel2 } from '@/api/train'; // 导入模型2的训练接口
import { getModel2TrainingStatus, getModel2FaultData } from '@/api/getData'; // 导入获取训练状态和故障数据的接口

ChartJS.register(...registerables, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const { Title } = Typography;

const Sensitive: React.FC = () => {
    const [learningRate, setLearningRate] = useState<number>(0.01);
    const [epochs, setEpochs] = useState<number>(10);
    const [trainingData, setTrainingData] = useState<any>({ trainLoss: [], trainAcc: [], testAcc: [] });
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [lockedEpochs, setLockedEpochs] = useState<number>(epochs);
    const [faultData, setFaultData] = useState<any>(null);
    const [faultImage, setFaultImage] = useState<string | null>(null);

    // 获取训练状态
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTraining) {
            interval = setInterval(() => {
                getModel2TrainingStatus()
                    .then((status) => {
                        // 确保训练数据都是数组
                        if (Array.isArray(status.train_loss) &&
                            Array.isArray(status.train_acc) &&
                            Array.isArray(status.test_acc)) {

                            // 获取训练损失和准确率的长度
                            const trainLength = status.train_loss.length;

                            // 如果 testAcc 数量不足，使用最后一个值填充
                            let testAcc = status.test_acc;
                            if (testAcc.length < trainLength) {
                                const lastValue = testAcc[testAcc.length - 1] || 0; // 如果没有值，使用 0 填充
                                testAcc = [...testAcc, ...Array(trainLength - testAcc.length).fill(lastValue)];
                            }

                            // 更新训练数据
                            setTrainingData({
                                trainLoss: status.train_loss,
                                trainAcc: status.train_acc,
                                testAcc: testAcc,
                            });

                            // 检查训练是否完成
                            if (status.status === 'completed') {
                                setIsTraining(false);
                                setTrainingComplete(true);
                                clearInterval(interval);
                            }
                        } else {
                            console.error('返回的数据格式不正确:', status);
                        }
                    })
                    .catch((error) => {
                        console.error('获取训练状态失败:', error);
                        message.error('获取训练状态失败，请稍后重试');
                    });
            }, 2000); // 每2秒获取一次状态
        }

        return () => clearInterval(interval); // 清理定时器
    }, [isTraining]);


    const startTraining = () => {
        setIsTraining(true);
        setTrainingData({ trainLoss: [], trainAcc: [], testAcc: [] }); // 重置训练数据
        setTrainingComplete(false);
        setLockedEpochs(epochs); // 开始训练时锁定 epochs

        // 调用训练接口
        startTrainingModel2({ learningRate, epochs })
            .then((response) => {
                console.log('训练开始:', response);
            })
            .catch((error) => {
                console.error('训练失败:', error);
                message.error('模型训练失败，请重试');
                setIsTraining(false); // 训练失败，重置状态
            });
    };

    const startTest = () => {
        setIsTesting(true);
        getModel2FaultData()
            .then((data) => {
                console.log('故障诊断数据:', data);
                setFaultData(data);
                setFaultImage(`http://127.0.0.1:5000/${data['图像路径']}`);
            })
            .catch((error) => {
                console.error('故障诊断失败:', error);
                message.error('故障诊断失败，请重试');
            })
            .finally(() => {
                setIsTesting(false);
            });
    };

    // 图表数据配置
    const chartData = {
        labels: Array.from({ length: trainingData.trainLoss.length }, (_, i) => i + 1), // 使用训练数据的长度作为标签
        datasets: [
            {
                label: '训练损失',
                data: trainingData.trainLoss,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: '训练准确率',
                data: trainingData.trainAcc,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            },
            {
                label: '测试准确率',
                data: trainingData.testAcc,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    };

    return (
        <>
            <Card title="模型训练参数设置" bordered={false} style={{ marginTop: '20px' }}>
                <Form style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 200 }}>
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
                        disabled={isTraining}
                        style={{ width: '200px', padding: '10px' }}
                    >
                        {isTraining ? '模型训练中...' : '开始训练'}
                    </Button>
                    <Button
                        type={trainingComplete ? 'primary' : 'default'}
                        onClick={startTest}
                        disabled={!trainingComplete || isTesting}
                        style={{ width: '200px', padding: '10px' }}
                    >
                        {isTesting ? '故障诊断中...' : '故障诊断'}
                    </Button>
                </div>
            </Card>

            {trainingData.trainLoss.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 30 }}>
                    <Card title="训练曲线" bordered={false} style={{ flex: 3, marginRight: '20px' }}>
                        <div className="chart-container-acc">
                            <Line data={chartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        grid: { display: false },
                                    },
                                    y: {
                                        grid: { display: false },
                                    },
                                },
                            }} />
                        </div>
                    </Card>
                </div>
            )}

            {faultData && (
                <Card title="故障诊断结果" bordered={false} style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* 图片部分 */}
                        <div style={{ flex: 2 }}>
                            {faultImage ? (
                                <img
                                    src={faultImage}
                                    alt="故障诊断图"
                                    style={{ width: '80%', height: 'auto' }}
                                />
                            ) : (
                                <span>正在加载故障诊断图像...</span>
                            )}
                        </div>

                        {/* 数据部分 */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                fontSize: '1rem',
                                marginTop: '30%',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ fontWeight: 'bold', marginRight: 5 }}>漏检率:</p>
                                    <p>{faultData['漏检率']}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ fontWeight: 'bold', marginRight: 5 }}>误检率:</p>
                                    <p>{faultData['误检率']}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ fontWeight: 'bold', marginRight: 5 }}>故障检测周期（ms）:</p>
                                    <p>{faultData['故障检测周期（单位为ms）']}</p> {/* 修正键名 */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};

export default Sensitive;
