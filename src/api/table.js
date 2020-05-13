import request from '@/utils/request'

// 分页获取列表
export function getList(params) {
    return request({
        url: '/WLXF/getXFYSZLList',
        method: 'post',
        params
    })
}

// 删除
export function deleteItem(params) {
    return request({
        url: '/WLXF/getXFYSZLDel',
        method: 'post',
        params,
    })
}

// 新增或则修改（id不传是新增，传了是修改）
export function updateItem(params) {
    return request({
        url: '/WLXF/getXFYSZLAdd',
        method: 'post',
        params,
    })
}

// 根据fileid获取OSS URL
export function getOssUrl(params) {
    return request({
        url: '/xc/GetFileOssUrl',
        method: 'post',
        params
    })
}
