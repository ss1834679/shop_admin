import file from "../utils/file"

/**
 * 上传文件 自己搭的
 * @param {*} filelist 
 */
// export function uploadFile(filelist) {
//     let dataImg = new FormData()
//     dataImg.append("file", filelist)
//     return file({
//         url: "/file/uploadFile",
//         method: "post",
//         data: dataImg
//     })
// }

/**
 * 上传文件接口 阿里云
 * @param {*} filelist 文件数组
 * @param {*} path 文件夹名称（传值，就会在OSS上创建相应的文件夹，用于区分不同模块传输的数据，前端自定义）
 */
export function uploadFileOss(filelist, path) {
    let dataImg = new FormData()
    dataImg.append("file", filelist)
    return file({
        url: "/oss/uploadFile",
        method: "post",
        data: dataImg,
        params: { path }
    })
}