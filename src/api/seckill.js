import server from '../utils/request'

export function addSeckill(obj) {
    return server({
        url: '/admin/brand/add',
        method: 'post',
        params: obj,
    })
}

export function getSeckillList(obj) {
    /* 默认的每页数量 */
    obj['pageSize'] = 20
    return server({
        url: '/admin/brand/list',
        method: 'get',
        params: obj,
    })
}

export function getSeckill(obj) {
    return server({
        url: '/admin/brand/get',
        method: 'get',
        params: obj,
    })
}

export function updateSeckill(obj) {
    return server({
        url: '/admin/brand/update',
        method: 'put',
        data: obj,
    })
}
