import User from '../views/user/user'
import UserIndex from '../views/user/userIndex'

export default {
    path: '/user',
    name: 'usersad',
    component: User,
    children: [{
        path: 'index',
        name: 'userIdx',
        component: UserIndex
    }]
}