// src/api/uploadData.ts
import { message } from 'antd';

const BASE_URL = 'http://127.0.0.1:5000'; // 后端服务地址

// 针对模型1的 API 函数
export const fetchDataModel1 = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model1/data`); // 获取模型1数据
        if (!response.ok) throw new Error('网络错误');
        const result = await response.json();
        return result;
    } catch (error) {
        message.error('获取数据失败');
        throw error;
    }
};

export const uploadFileModel1 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/model1/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('上传失败');
        throw error;
    }
};

export const deleteFileModel1 = async (filename: string) => {
    try {
        const response = await fetch(`${BASE_URL}/model1/delete/${filename}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('删除失败');
        throw error;
    }
};




// 针对模型2的 API 函数
export const fetchDataModel2 = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model2/data`); // 获取模型1数据
        if (!response.ok) throw new Error('网络错误');
        const result = await response.json();
        return result;
    } catch (error) {
        message.error('获取数据失败');
        throw error;
    }
};

export const uploadFileModel2 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/model2/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('上传失败');
        throw error;
    }
};

export const deleteFileModel2 = async (filename: string) => {
    try {
        const response = await fetch(`${BASE_URL}/model2/delete/${filename}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('删除失败');
        throw error;
    }
};






// 针对模型3的 API 函数
export const fetchDataModel3 = async () => {
    try {
        const response = await fetch(`${BASE_URL}/model3/data`); // 获取模型1数据
        if (!response.ok) throw new Error('网络错误');
        const result = await response.json();
        return result;
    } catch (error) {
        message.error('获取数据失败');
        throw error;
    }
};

export const uploadFileModel3 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/model3/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('上传失败');
        throw error;
    }
};

export const deleteFileModel3 = async (filename: string) => {
    try {
        const response = await fetch(`${BASE_URL}/model3/delete/${filename}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        message.success(result.message);
        return result;
    } catch (error) {
        message.error('删除失败');
        throw error;
    }
};