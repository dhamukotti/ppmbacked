const { response } = require('../constants')
const { Signup, RecentActivity } = require('../models')

const showLogs = true

const list = async (req, res) => {
  try {
    const { taskID } = req?.query

    let recentActivityList = []

    recentActivityList = await RecentActivity.findAll({
      where: { TaskMasterID: taskID },
      include: [{ model: Signup, as: 'doneBy', attributes: ['Email', 'Name', 'UserID', 'ProfilePicture'] }],
      order: [['DoneAt', 'DESC']]
    })

    if (recentActivityList?.length) {
      return response('recent-activity-list', req, res, true, 200, 'successGetRecentActivityList', recentActivityList)
    } else {
      return response('recent-activity-list', req, res, true, 202, 'successGetRecentActivityListNoFound', [])
    }
  } catch (error) {
    showLogs && console.error('recent-activity-list error :', error)

    return response('recent-activity-list', req, res, false, 422, 'failedToGetRecentActivityList')
  }
}

module.exports.recentActivityController = {
  list
}
