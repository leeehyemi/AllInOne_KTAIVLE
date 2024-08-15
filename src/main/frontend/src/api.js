import axios from 'axios';

const api = axios.create({
    baseURL: 'https://allinone-spring.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
         'Access-Control-Allow-Origin' : 'https://allinnone.net'
    },
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        } else if (error.request) {
            throw new Error("No response received from server");
        } else {
            throw new Error("Error setting up the request");
        }
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/login', userData);
        console.log('Login response:', response); // 로그 추가
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response || error); // 로그 추가
        if (error.response) {
            throw new Error(error.response.data.message || "Server responded with an error");
        } else if (error.request) {
            throw new Error("No response received from server");
        } else {
            throw new Error("Error setting up the request");
        }
    }
};