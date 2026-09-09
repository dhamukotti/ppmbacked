const { commands } = require('../constants/command')
const { sequelize } = require('../db-connection')

const createRecentActivityRecord = async ({
  title,
  description,
  taskID = null,
  subTaskID = null,
  additionColID = null,
  doneBy,
  activityType,
  previousState = null,
  newState = null,
  isCritical = 0
}) => {
  return await sequelize.query(
    'EXEC spc_RecentActivityMgt @Command = :command, @TaskMasterID = :taskID, @AdditionalColumnID = :additionColID, @SubTasksID = :subTaskID,@DoneBy = :doneBy, @Title = :title, @Description = :description, @ActivityType = :activityType, @PreviousState = :previousState, @NewState = :newState, @IsCritical = :isCritical',
    {
      type: sequelize?.QueryTypes?.SELECT,
      replacements: {
        command: commands.recentActivityCreate,
        title,
        description,
        taskID,
        subTaskID,
        additionColID,
        doneBy,
        activityType,
        previousState,
        newState,
        isCritical
      }
    }
  )
}

module.exports = createRecentActivityRecord
