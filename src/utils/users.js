const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!room || !username) {
        return {
            error: 'Username and Room are required!'
        }
    }

    // Check for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (existingUser) {
        return {
            error: 'Username is already in use in this room'
        }
    }

    // Store user

    const user = { id, username, room }
    users.push(user)
    return { user }

}

// Remove User Function

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Get User

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

 const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
 }
 
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}