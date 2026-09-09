const { validationResult } = require('express-validator')
const { response } = require('../constants')

const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const DynamicDropdown = require('../models/dynamic-dropdown')

// ** List Project
const list = async (req, res) => {
  try {
    const taskGroupID = req?.query?.taskGroupID

    const dynamicDropdownlist = await DynamicDropdown.findAll({
      raw: true,
      where: { TaskgroupID: taskGroupID, IsDelete: 0 }
    })

    if (dynamicDropdownlist?.length) {
      return response('dropdown-list', req, res, true, 200, 'successDropdownList', dynamicDropdownlist)
    } else {
      return response('dropdown-list', req, res, true, 202, 'dropdownListNoData', [])
    }
  } catch (error) {
    return response('dropdown-list', req, res, false, 422, 'failedDropdownList', null, error)
  }
}

const add = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const { Valuetxt, WorkspaceID, ProjectID, TaskGroupID, TaskID } = req?.body

      await sequelize.query(
        'EXEC spc_DynamicDropDownListMgt @Command = :command, @Valuetxt = :Valuetxt, @WorkspaceID = :WorkspaceID, @ProjectID = :ProjectID, @TaskGroupID = :TaskGroupID, @TaskID = :TaskID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.createDropdown,
            Valuetxt,
            TaskGroupID,
            WorkspaceID,
            ProjectID,
            TaskID
          },
          raw: true
        }
      )

      return response('dropdown-add', req, res, true, 201, 'successDropdownAdd', null)
    } else {
      return response('dropdown-add', req, res, false, 400, 'failedDropdownAdd', null, errors.array())
    }
  } catch (error) {
    return response('dropdown-add', req, res, false, 422, 'failedDropdownAdd', null, error)
  }
}

const deleteDP = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const DynamicDropdownID = req?.params?.id

      await sequelize.query(
        'EXEC spc_DynamicDropdownManagement @Command = :command, @DynamicDropdownID = :DynamicDropdownID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.removeDropdown,
            DynamicDropdownID
          },
          raw: true
        }
      )

      return response('dropdown-delete', req, res, true, 201, 'successDropdownAdd', null)
    } else {
      return response('dropdown-delete', req, res, false, 400, 'failedDropdownAdd', null, errors.array())
    }
  } catch (error) {
    return response('dropdown-delete', req, res, false, 422, 'failedDropdownAdd', null, error)
  }
}

const update = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const DynamicDropDownID = req?.params?.id
      const { Valuetxt } = req?.body

      await DynamicDropdown.update({ Valuetxt }, { where: { Dynamic_ddl_ID: DynamicDropDownID } })

      return response('dropdown-update', req, res, true, 201, 'successDropdownUpdate', null)
    } else {
      return response('dropdown-update', req, res, false, 400, 'failedDropdownUpdate', null, errors.array())
    }
  } catch (error) {
    console.log('error :', error)

    return response('dropdown-update', req, res, false, 422, 'failedDropdownUpdate', null, error)
  }
}

module.exports.dpController = {
  list,
  add,
  deleteDP,
  update
}
