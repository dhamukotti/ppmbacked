const { default: Sequelize } = require('@sequelize/core')
const { response } = require('../constants')
const TaskUpdates = require('../models/task-updates')
const { Signup } = require('../models')
const TaskUpdateLikes = require('../models/task-update-likes')

const listUpdates = async (req, res) => {
  try {
    const { taskID } = req?.params
    const userID = req?.current_user?.UserID

    const taskUpdateList = await TaskUpdates.findAll({
      where: { TaskID: taskID },
      include: [
        { model: Signup, attributes: ['Name', 'ProfilePicture', 'UserID', 'Email'], as: 'createdBy' },
        {
          model: TaskUpdateLikes,
          attributes: ['UserID'],
          where: { UserID: userID },
          required: false // Include whether the user has liked the update
        }
      ]
    })

    const taskUpdatesWithLikes = taskUpdateList.map(update => ({
      ...update.toJSON(),
      isLiked: update?.taskUpdateLikes?.length > 0,
      replies: taskUpdateList?.filter(r => r?.ParentUpdateID === update?.UpdateID)
    }))

    return response(
      'task-updates',
      req,
      res,
      true,
      200,
      'taskUpdatesFetchSuccess',
      taskUpdatesWithLikes?.filter(v => !v?.ParentUpdateID)
    )
  } catch (error) {
    console.log('error :', error)

    return response('task-updates', req, res, false, 422, 'failedToGetTasks')
  }
}

const writeUpdate = async (req, res) => {
  try {
    const { message, taskID } = req?.body

    const taskUpdate = await TaskUpdates.create({
      Message: message,
      TaskID: taskID,
      CreatedBy: req?.current_user?.UserID,
      CreateDate: Sequelize.fn('GETDATE'),
      IsDelete: 0
    })

    return response('task-updates', req, res, true, 200, 'taskUpdatesFetchSuccess', taskUpdate)
  } catch (error) {
    console.log('error :', error)

    return response('task-updates', req, res, false, 422, 'failedToGetTasks')
  }
}

const likeUpdate = async (req, res) => {
  try {
    const { updateID } = req.params
    const userID = req?.current_user?.UserID

    // Check if the user has already liked the update
    const existingLike = await TaskUpdateLikes.findOne({
      where: { UpdateID: updateID, UserID: userID }
    })

    if (existingLike) {
      // If the like exists, remove it (toggle behavior)
      await TaskUpdateLikes.destroy({ where: { LikeID: existingLike.LikeID } })

      return response('task-updates', req, res, true, 200, 'updateUnliked', { liked: false })
    }

    // Add a new like
    const like = await TaskUpdateLikes.create({ UpdateID: updateID, UserID: userID })

    return response('task-updates', req, res, true, 200, 'updateLiked', { liked: true, like })
  } catch (error) {
    console.log('error :', error)

    return response('task-updates', req, res, false, 422, 'failedToLikeUpdate')
  }
}

const replyToUpdate = async (req, res) => {
  try {
    const { message, updateID, taskID } = req.body
    const userID = req?.current_user?.UserID

    const reply = await TaskUpdates.create({
      Message: message,
      TaskID: taskID,
      ParentUpdateID: updateID,
      CreatedBy: userID,
      CreateDate: Sequelize.fn('GETDATE'),
      IsDelete: 0
    })

    return response('task-updates', req, res, true, 200, 'updateReplied', reply)
  } catch (error) {
    console.log('error :', error)

    return response('task-updates', req, res, false, 422, 'failedToReplyToUpdate')
  }
}

module.exports.taskUpdatesController = { listUpdates, writeUpdate, likeUpdate, replyToUpdate }
