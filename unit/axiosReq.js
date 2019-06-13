//import Vue from 'vue'
import axios from 'axios'
const myaxios = axios// 不跨域的axios
// 如果要跨域的话, 对axios进行一些设置,当前使用的是跨域的
const axiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json;charset=utf-8' },// 设置传输内容的类型和编码
    withCredentials: true,// 指定某个请求应该发送凭据。允许客户端携带跨域cookie，也需要此配置
});

export default axiosInstance