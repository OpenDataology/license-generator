/*
api.env.ts

Copyright (c) 2022 The OpenDataology Authors 
All rights reserved.

SPDX-License-Identifier: Apache-2.0
*/



import axios from "./https.env"
import { Token } from "./https.env"


/**
 * API 2.1 List all the dataset licenses
 * @param {String} url 
 * @param {Object} parms 
 * @returns 
 */
export const getLicenseDataAll = (data:any = {}) => {
    return axios.request({
        url: "/data-license",
        method: "get",
        params: {
            pageSize: data.pageSize,
            pageNum: data.pageNum,
            token: Token,
        },
    })
}
/**
 * API 2.1 List the filtered dataset licenses
 * @param {String} url 
 * @param {Object} parms 
 * @returns 
 */
 export const getLicenseCondition = (data:any = {}) => {
    var obj:any = {};
    if (data.conditions.size != undefined && data.conditions.size != 0){
        for (let [key, value] of data.conditions) {
            obj[key] = value;
        }
    }
    return axios.request({
        url: "/licenses_sc",
        method: "post",
        params: {
            pageSize: data.pageSize,
            pageNum: data.pageNum,
            token: Token,
        },
        data: obj
    })
}
