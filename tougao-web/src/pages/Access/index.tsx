import React, { useState, useEffect } from 'react';
import { Upload, Select, Typography, Card, Button, message } from 'antd';
import { Line } from 'react-chartjs-2';
import { UploadOutlined } from '@ant-design/icons';
import { fetchDataModel2, uploadFileModel2, deleteFileModel2 } from '@/api/uploadData'; // 导入模型2的API函数
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, registerables } from 'chart.js';
import './index.less';
import Sensitive from './Sensitive';

ChartJS.register(...registerables, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const { Option } = Select;
const { Title } = Typography;

const AccessPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // 存储上传的样本数据
  const [selectedFile, setSelectedFile] = useState<number | null>(null); // 当前选择的CSV索引
  const [selectedSample, setSelectedSample] = useState<number | null>(null); // 当前选择的样本索引
  const [isUploaded, setIsUploaded] = useState<boolean>(false); // 判断是否上传完成

  // 加载数据函数
  const loadData = async () => {
    try {
      const result = await fetchDataModel2(); // 使用模型2的API获取数据
      setData(result);
      setIsUploaded(true); // 设置上传完成状态

      // 默认选择第一个文件和第一个样本
      if (result.length > 0) {
        setSelectedFile(0);
        setSelectedSample(0);
      }
    } catch (error) {
      message.error('获取数据失败'); // 提示用户获取数据失败
    }
  };

  // 在组件挂载时加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 处理文件上传
  const handleUpload = async (file: File) => {
    try {
      await uploadFileModel2(file); // 使用模型2的API上传文件
      await loadData(); // 上传后重新加载数据
      message.success('文件上传成功'); // 提示用户上传成功
    } catch (error) {
      message.error('上传文件失败'); // 提示用户上传失败
    }
    return false; // 防止默认上传
  };

  // 删除上传的文件
  const handleDelete = async (index: number) => {
    if (index !== null) {
      const filename = data[index]?.name; // 获取文件名
      try {
        await deleteFileModel2(filename); // 使用模型2的API删除文件
        const updatedData = data.filter((_, i) => i !== index); // 更新数据
        setData(updatedData); // 更新状态

        // 如果删除的文件是当前选择的文件，重置选择
        if (index === selectedFile) {
          setSelectedFile(null);
          setSelectedSample(null);
        }

        message.success('文件删除成功'); // 提示用户删除成功
      } catch (error) {
        message.error('删除文件失败'); // 提示用户删除失败
      }
    }
  };

  // 图表数据配置
  const chartData = {
    labels: Array.from({ length: 128 }, (_, i) => i + 1),
    datasets: [
      {
        label: `样本 ${selectedSample !== null ? selectedSample + 1 : ''}`,
        data: selectedSample !== null ? data[selectedFile!]?.samples[selectedSample] : [],
        borderColor: 'rgba(80, 123, 205, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { display: false } },
    },
  };

  return (
    <>
      <Title level={4}>状态迁移学习</Title>
      <Card title="数据上传" bordered={false} style={{ marginBottom: '20px' }}>
        <div className="upload-container">
          <div style={{ textAlign: 'center' }}>
            <Upload beforeUpload={handleUpload} showUploadList={false} className="custom-upload">
              <UploadOutlined style={{ fontSize: '36px', marginBottom: 8 }} />
            </Upload>
            <p style={{ color: '#555' }}>支持上传 CSV 格式的文件</p>
          </div>
        </div>

        {/* 仅在文件上传后显示数据绘图部分 */}
        {isUploaded && (
          <div className="chart-container">
            {data.length > 0 ? (
              <>
                <div className="chart-header">
                  <h4>数据文件选择</h4>
                  <Select
                    style={{ width: 200, marginBottom: 10 }}
                    placeholder="选择数据文件"
                    value={selectedFile !== null ? selectedFile : undefined}
                    onChange={value => {
                      setSelectedFile(value);
                      setSelectedSample(0); // 重置样本选择
                    }}
                  >
                    {data.map((file, index) => (
                      <Option key={index} value={index}>
                        {file.name}
                      </Option>
                    ))}
                  </Select>
                  <h4>样本选择</h4>

                  <Select
                    style={{ width: 200, marginBottom: 10 }}
                    placeholder="选择样本"
                    value={selectedSample !== null ? selectedSample : undefined}
                    onChange={value => setSelectedSample(value)}
                  >
                    {data[selectedFile!]?.samples.map((_, index) => (
                      <Option key={index} value={index}>
                        样本 {index + 1}
                      </Option>
                    ))}
                  </Select>

                  <Button
                    danger
                    type="default"
                    style={{ marginBottom: 10 }}
                    onClick={() => handleDelete(selectedFile!)} // 删除当前文件
                  >
                    删除当前数据文件
                  </Button>
                </div>

                {selectedSample !== null && (
                  <div className="chart-box">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                )}
              </>
            ) : (
              <></>)}
          </div>
        )}
      </Card>
      <Sensitive />
    </>
  );
};

export default AccessPage;
