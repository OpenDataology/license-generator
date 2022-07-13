import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:30900/api/v1";// TODO:metadata-api example:http://127.0.0.1:9123/api/v1
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers={
                'token':token
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
axios.interceptors.response.use(
    config => {
        if (config.status === 200) {
            return config.data;
        }
    },
    error => {
        error.message = 'overtime'
        return Promise.reject(error)
    }
)

export const Token = '' // TODO:metadata-api Token
export const Portal_Frontend_Base_URL = 'http://www.opendataology.com:30800' // TODO:portal frontend url
export const Portal_Frontend_Detail_URL = Portal_Frontend_Base_URL +'/#/licenseInfo'
export const Portal_Frontend_Upload_URL = Portal_Frontend_Base_URL +'/#/uploadLicense'

export default axios;
