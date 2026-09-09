const { response } = require('../../constants')
const SprintGroups = require('../../models/sprint-management/sprint-group')

const showLogs = process.env.NODE_ENV === 'development'

const list = async (req, res) => {
  const workspaceID = Number(req?.query?.workspaceID)

  try {
    if (workspaceID) {
      const taskGroups = await SprintGroups.findAll({
        where: { WorkspaceID: workspaceID, IsDelete:0 }
      })

      if (taskGroups?.length !== 0) {
        return response('sprintGroup-list', req, res, true, 200, 'sprintGroupListFound', taskGroups)
      }
    }

    return response('sprintGroup-list', req, res, true, 202, 'sprintGroupListFound', [])
  } catch (error) {
    showLogs && console.error('error :', error)

    return response('sprintGroup-list', req, res, false, 422, 'sprintGroupListFailed')
  }
}

const create = async (req, res) => {
  try {
    const { workspaceID, name } = req?.body

    await SprintGroups.create({
      WorkspaceID: workspaceID,
      GroupName: name
    })

    return response('sprintGroup-list', req, res, true, 202, 'sprintGroupListFound', [])
  } catch (error) {
    showLogs && console.error('error :', error)

    return response('sprintGroup-list', req, res, false, 422, 'sprintGroupListFailed')
  }
}

const update = async (req, res) => {
  try {
    const SprintGroupID = req?.params?.id
    const { name } = req?.body

    if (!SprintGroupID) {
      return response('sprintGroup-update', req, res, false, 422, 'sprintGroupListFailed')
    }

    await SprintGroups.update(
      {
        GroupName: name
      },
      { where: { SprintGroupID } }
    )

    return response('sprintGroup-list', req, res, true, 202, 'sprintGroupListFound', [])
  } catch (error) {
    showLogs && console.error('error :', error)

    return response('sprintGroup-list', req, res, false, 422, 'sprintGroupListFailed')
  }
}

const deleteSprintGroup = async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if record exists
    const sprintGroup = await SprintGroups.findByPk(id)
    if (!sprintGroup) {
      return response('sprintGroup-delete', req, res, false, 404, 'sprintGroupNotFound', {})
    }
    
    // Permanently delete the record
    await SprintGroups.destroy({
      where: { SprintGroupID: id }
    })

    return response('sprintGroup-delete', req, res, true, 200, 'successSprintGroupDeleted', {})
  } catch (error) {
    showLogs && console.error('DELETE SPRINT GROUP ERROR:', error)
    return response('sprintGroup-delete', req, res, false, 500, 'failedSprintGroupDeletion', {})
  }
}


module.exports.sprintGroupController = {
  list,
  create,
  update,
  deleteSprintGroup
}
