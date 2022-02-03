import index from '../views/index/index'
import indexIndex from '../views/index/indexIndex'
import Get from '../views/index/Get'

export default {
    path: "/index",
    name: "home",
    component: index,
    children:[
        {
            path:'index',
            name:'indexIdx',
            component:indexIndex
        },
        {
            path:'get',
            name:'get',
            component:Get
        }
    ]
}