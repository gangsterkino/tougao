import { message } from 'antd';

const BASE_URL = 'http://127.0.0.1:5000'; // 后端服务地址

// 获取模型1的训练状态
export const getModel1TrainingStatus = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model1/training_status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回训练状态
    } catch (error) {
        message.error('获取模型1训练状态失败');
        throw error;
    }
};

// 获取模型1的故障数据评估结果
export const getModel1FaultData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model1/fault_data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回故障数据评估结果
    } catch (error) {
        message.error('获取模型1故障数据失败');
        throw error;
    }
};

// 获取模型2的训练状态
export const getModel2TrainingStatus = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model2/training_status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回训练状态
    } catch (error) {
        message.error('获取模型2训练状态失败');
        throw error;
    }
};
// 获取模型2的故障数据评估结果
export const getModel2FaultData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model2/fault_data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回故障数据评估结果
    } catch (error) {
        message.error('获取模型2故障数据失败');
        throw error;
    }
};

// 获取模型3的训练状态
export const getModel3TrainingStatus = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model3/training_status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回训练状态
    } catch (error) {
        message.error('获取模型3训练状态失败');
        throw error;
    }
};

// 获取模型3的混淆矩阵图像
export const getModel3FaultData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model3/fault_data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result; // 返回故障数据评估结果
    } catch (error) {
        message.error('获取模型3数据生成图失败');
        throw error;
    }
};
