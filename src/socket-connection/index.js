const socketIo = require('socket.io')

let io

const initSocket = (server, options) => {
  console.log('called')
  console.log(server)
  io = socketIo(server, options)

  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`)

    // Handle client subscribing to a project
    socket.on('subscribeToProject', projectId => {
      console.log(`User ${socket.id} subscribed to project: ${projectId}`)
      socket.join(`project_${projectId}`) // User joins a project-specific room
    })

    // Handle client unsubscribing from a project
    socket.on('unsubscribeFromProject', projectId => {
      // console.log(`User ${socket.id} unsubscribed from project: ${projectId}`)
      socket.leave(`project_${projectId}`) // User leaves the project-specific room
    })

    // Handle client disconnect
    socket.on('disconnect', () => {
      // console.log(`User disconnected: ${socket.id}`)
    })
  })
}

// Function to emit updates to specific project rooms
const sendProjectUpdate = (projectId, updateData) => {
  if (io) {
    io.to(`project_${projectId}`).emit('projectUpdate', { projectId, data: updateData })
  }
}

module.exports = {
  initSocket,
  sendProjectUpdate
}
