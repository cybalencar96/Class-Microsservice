import axios from 'axios'

axios.defaults.baseURL = "https://fierce-savannah-13251.herokuapp.com/"

function validateUser({username, password}) {
    return axios.post('/login',{username: username, password:password})
}

function getUser(userId) {
    return axios.get(`/user/${userId}`)
}

function updateUserClasses(userId, action, classType, classId) {
    const body = {
        userId: userId,
        action: action,
        classType: classType,
        classId: classId
    }

    return axios.put('/user/classes', body)
}

export {
    validateUser,
    getUser,
    updateUserClasses
}