import { message } from 'antd';

const BASE_URL = 'http://127.0.0.1:5000'; // 后端服务地址

// 模型1的训练接口
export const startTrainingModel1 = async (params: any) => {
    try {
        const response = await fetch(`${BASE_URL}/model1/train`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('训练模型1失败');
        throw error;
    }
};

// 模型2的训练接口
export const startTrainingModel2 = async (params: any) => {
    try {
        const response = await fetch(`${BASE_URL}/model2/train`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('训练模型2失败');
        throw error;
    }
};

// 模型3的训练接口A

export const startTrainingModel3A = async (params: any) => {
    try {
        const response = await fetch(`${BASE_URL}/model3/trainA`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error('服务器返回错误状态');
        }

        // 解析 JSON 响应
        const result = await response.json();

        // 成功后，返回服务器响应
        message.success(result.message);
        return result;
    } catch (error) {
        message.error(`训练模型3A失败`);
        throw error;
    }
};


// 模型3的训练接口B
export const startTrainingModel3B = async (params: any) => {
    try {
        const response = await fetch(`${BASE_URL}/model3/trainB`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('训练模型3B失败');
        throw error;
    }
};
