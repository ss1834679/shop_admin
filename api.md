{
    "swagger": "2.0",
    "info": {
        "description": "文件服务接口",
        "version": "1.0",
        "title": "文件服务接口",
        "contact": {
            "name": "作者",
            "url": "blog.csdn.net",
            "email": "543219782@qq.com"
        },
        "license": {
            "name": "The Apache License",
            "url": "http://www.baidu.com"
        }
    },
    "host": "192.168.0.233:8400",
    "basePath": "/",
    "tags": [{
        "name": "file-data-controller",
        "description": "File Data Controller"
    }, {
        "name": "url-mapping-controller",
        "description": "Url Mapping Controller"
    }],
    "paths": {
        "/file": {
            "get": {
                "tags": ["file-data-controller"],
                "summary": "自定义获取文件接口",
                "operationId": "findFileByUrlUsingGET",
                "produces": ["*/*"],
                "parameters": [{
                    "name": "url",
                    "in": "path",
                    "description": "文件的url",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "userId",
                    "in": "path",
                    "description": "用户的id",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            },
            "post": {
                "tags": ["file-data-controller"],
                "summary": "上传文件接口",
                "operationId": "uploadFileUsingPOST",
                "consumes": ["application/json"],
                "produces": ["*/*"],
                "parameters": [{
                    "name": "file",
                    "in": "formData",
                    "description": "文件数组",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "201": {
                        "description": "Created"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/file/getByFileId/{fileId}": {
            "get": {
                "tags": ["file-data-controller"],
                "summary": "根据查找文件接口",
                "operationId": "getByFileIdUsingGET",
                "produces": ["*/*"],
                "parameters": [{
                    "name": "fileId",
                    "in": "path",
                    "description": "文件的id值",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/file/getByHash/{hash}": {
            "get": {
                "tags": ["file-data-controller"],
                "summary": "根据hash查找文件接口",
                "operationId": "getByHashUsingGET",
                "produces": ["*/*"],
                "parameters": [{
                    "name": "hash",
                    "in": "query",
                    "description": "文件的hash值",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/file/{fileId}": {
            "get": {
                "tags": ["file-data-controller"],
                "summary": "根据id下载文件接口",
                "operationId": "getFileByFileIdUsingGET",
                "produces": ["*/*"],
                "parameters": [{
                    "name": "fileId",
                    "in": "path",
                    "description": "文件的id值",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/url/checkUrlMapping": {
            "get": {
                "tags": ["url-mapping-controller"],
                "summary": "查询文件的url",
                "operationId": "checkUrlMappingUsingGET",
                "produces": ["*/*"],
                "parameters": [{
                    "name": "url",
                    "in": "query",
                    "description": "文件的url",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "userId",
                    "in": "query",
                    "description": "用户的id",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/url/deleteUrlMapping": {
            "post": {
                "tags": ["url-mapping-controller"],
                "summary": "删除文件的url映射",
                "operationId": "deleteUrlMappingUsingPOST",
                "consumes": ["application/json"],
                "produces": ["*/*"],
                "parameters": [{
                    "name": "url",
                    "in": "query",
                    "description": "文件的url",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "userId",
                    "in": "query",
                    "description": "用户的id",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "201": {
                        "description": "Created"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/url/setUrlMapping": {
            "post": {
                "tags": ["url-mapping-controller"],
                "summary": "设置文件的url映射，定义文件的url",
                "operationId": "setUrlMappingUsingPOST",
                "consumes": ["application/json"],
                "produces": ["*/*"],
                "parameters": [{
                    "name": "fileId",
                    "in": "query",
                    "description": "文件的id",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "url",
                    "in": "query",
                    "description": "文件的url",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "userId",
                    "in": "query",
                    "description": "用户的id",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "201": {
                        "description": "Created"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
        "/url/updateUrlMapping": {
            "post": {
                "tags": ["url-mapping-controller"],
                "summary": "修改文件的url映射，定义文件的url",
                "operationId": "updateUrlMappingUsingPOST",
                "consumes": ["application/json"],
                "produces": ["*/*"],
                "parameters": [{
                    "name": "fileId",
                    "in": "query",
                    "description": "文件的id",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "url",
                    "in": "query",
                    "description": "文件的url",
                    "required": false,
                    "type": "string"
                }, {
                    "name": "userId",
                    "in": "query",
                    "description": "用户的id",
                    "required": false,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "201": {
                        "description": "Created"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        }
    }
}