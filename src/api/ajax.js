import axios from 'axios'
import {message} from 'antd'
import Constant from '../utils/constant'
// import qs from 'qs'


axios.interceptors.request.use(function (config) {
    config.baseURL=Constant.Url;
    config.withCredentials = true;
    if(config.url.startsWith("/admin")){
        let token = window.localStorage.getItem('admin_token');
        if (token) {
            token = 'Bearer ' + token;
            config.headers['Authorization'] = token
        }
    }else {
        let token = window.localStorage.getItem('user_token');
        if (token) {
            token = 'Bearer ' + token;
            config.headers['Authorization'] = token
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error)
});
axios.interceptors.response.use(function (response) {
    if (response.status===401) {
        message.error("请重新登录后操作!");
        if(response.config.url.startsWith(`${Constant.Url}/admin`)){
            window.localStorage.removeItem("admin_token");//可能为失效，所以移除
        }else {
            window.localStorage.removeItem("user_token");
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        if (type === 'GET') {
            promise = axios.get(url, {params: data});
        } else if (type === 'POST') {
            promise = axios.post(url, data);
        } else if (type === 'PUT') {
            promise = axios.put(url, data);
        } else if (type === 'DELETE') {
            promise = axios.delete(url, data);
        }
        promise.then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
          //  message.error(`请求出错: ` + error.message);
        })
    })

}

