const { response } = require('../constants')
const AutomationRules = require('../models/automation-rules')

const get = async (req, res) => {
  try {
    const { projectId } = req.params

    const rules = await AutomationRules.findAll({
      where: { ProjectID: projectId }
    })

    return response('automation-rules', req, res, true, 200, 'getAutomationRulesSuccess', rules)
  } catch (error) {
    console.error('Error fetching automation rules:', error)

    return response('automation-rules', req, res, false, 500, 'getAutomationRulesFailed')
  }
}

const add = async (req, res) => {
  try {
    const { ProjectID, trigger, conditions } = req.body

    const CreatedBy = req?.current_user?.UserID

    const newRule = await AutomationRules.create({
      ProjectID,
      trigger,
      conditions,
      CreatedBy,
      UpdatedBy: CreatedBy
    })

    return response('automation-rules', req, res, true, 200, 'addAutomationRules', newRule)
  } catch (error) {
    console.error('Error creating automation rule:', error)

    return response('automation-rules', req, res, false, 422, 'addAutomationRulesFailed')
  }
}

const update = async (req, res) => {
  try {
    const { ruleId } = req.params
    const { trigger, conditions, UpdatedBy } = req.body

    const updatedRule = await AutomationRules.update({ trigger, conditions, UpdatedBy }, { where: { RuleID: ruleId } })

    return response('automation-rules', req, res, true, 200, 'updateAutomationRules', updatedRule)
  } catch (error) {
    console.error('Error updating automation rule:', error)

    return response('automation-rules', req, res, false, 500, 'updateAutomationRulesFailed')
  }
}

const deleteRule = async (req, res) => {
  try {
    const { ruleId } = req.params

    const deletedRule = await AutomationRules.destroy({
      where: { RuleID: ruleId }
    })

    return response('automation-rules', req, res, true, 200, 'deleteAutomationRules', deletedRule)
  } catch (error) {
    console.error('Error deleting automation rule:', error)

    return response('automation-rules', req, res, false, 500, 'deleteAutomationRulesFailed')
  }
}

module.exports.automationRulesController = {
  get,
  add,
  update,
  deleteRule
}
