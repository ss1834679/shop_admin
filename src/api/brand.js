import server from '../utils/server'

export function addBrand(obj) {
  return server({
    url: '/brand/add',
    method: 'post',
    data: obj,
  })
}

export function getBrandList(obj) {
  /* 默认的每页数量 */
  if (obj['pageSize'] == undefined) {
    obj['pageSize'] = 20
  }
  return server({
    url: '/brand/list',
    method: 'get',
    params: obj,
  })
}

export function getBrand(obj) {
  return server({
    url: '/brand/get',
    method: 'get',
    params: obj,
  })
}

export function updateBrand(obj) {
  return server({
    url: '/brand/update',
    method: 'post',
    data: obj,
  })
}

export function deleteBrand(obj) {
  return server({
    url: '/brand/delete',
    method: "delete",
    params: obj
  })
}
