import server from "../utils/server"

/**
 * 获取省直辖市地址列表
 */
export function getProvinceList() {
    return server({
        url: "/address/addr_queryProvince",
        method: "get"
    })
}
/**
 * 地址子级列表
 * @param {String} cri_code 地区id
 */
export function getRegionList(cri_code) {
    return server({
        url: "/address/addr_queryRegion",
        method: "get",
        params: { cri_code: cri_code }
    })
}
/**
 * 根据id查找城市
 * @param {String} id 城市id
 */
export function getCityById(id) {
    return server({
        url: "/address/addrById",
        method: "get",
        params: { id }
    })
}
/**
 * 根据经纬度及范围距离查找小区列表
 * @param {String} distance 范围距离单位km
 * @param {String} lng 经度
 * @param {String} lat 纬度
 */
export function getVillageList(distance, lng, lat) {
    return server({
        url: "/decorate/decorateVillageList",
        method: "get",
        params: {
            distance: distance,
            lat: lat,
            lng: lng
        }
    })
}
/**
 * 获取省市区
 */
export function getProvinceCityDistrict() {
    return server({
        url: "/address/getProvinceCityDistrict",
        method: "get",
        // params: { type: "1" }
    })
}

/**
 * 通过区id查询到当前区下的小区
 * @param {String} districtId 区id
 */
export function getVillageByDistrictId(districtId) {
    return server({
        url: "/address/getAddressByDistrictId",
        method: "get",
        params: { districtId }
    })
}