// automationHandler.js

const AutomationRules = require('../models/automation-rules')
const TaskGroups = require('../models/task-group')
const taskEventEmitter = require('./event-emitter')

// Event listener to process automation on task status change
taskEventEmitter.on('taskStatusUpdated', async task => {
  try {
    // Get automation rules for the task's project
    const automationRules = await AutomationRules.findAll({
      where: { ProjectID: task.ProjectID }
    })

    // Iterate over the automation rules and apply them
    for (const rule of automationRules) {
      // Example: If rule.trigger is 'statusCompleted', and task status is completed, move the task to another task group
      if (rule.trigger === 'statusCompleted' && task.status === 'completed') {
        const targetTaskGroup = await TaskGroups.findOne({
          where: { TaskGroupID: rule.conditions.targetTaskGroupId }
        })

        if (targetTaskGroup) {
          task.TaskGroupID = targetTaskGroup.ID
          await task.save()
          console.log(`Task ${task.ID} moved to TaskGroup ${targetTaskGroup.ID}`)
        }
      }
    }
  } catch (error) {
    console.error('Error processing automation rules:', error)
  }
})
