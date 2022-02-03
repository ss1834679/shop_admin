// import Setpage from '../views/system/Setpage'
import System from '../views/system/system'
import SystemIndex from '../views/system/sysIndex'

export default {
    path: '/system',
    name: 'system',
    component: System,
    children: [
        // {
        //     path: "set",
        //     name: "set",
        //     component: Setpage
        // },
        {
            path: 'index',
            name: 'sysIdx',
            component: SystemIndex
        }
    ]
}