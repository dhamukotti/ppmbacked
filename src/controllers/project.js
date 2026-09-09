const { validationResult } = require('express-validator')
const { response } = require('../constants')

const Project = require('../models/project')
const ProjectStatus = require('../models/project-status')
const ProjectPriority = require('../models/project-priority')
const { sendProjectUpdate } = require('../socket-connection')
const { Signup, AdditionalColumnValuesTask, ColumnTypeLookup } = require('../models')
const UserProjects = require('../models/user-project')
const { default: Sequelize } = require('@sequelize/core')
const Roles = require('../models/role')

// ** List Project
const listProject = async (req, res) => {
  try {
    const { workspaceID } = req?.query
    if (workspaceID) {
      const projectList = await Project.findAll({
        where: { WorkSpaceID: workspaceID, IsDelete: 0 },
        include: [
          {
            model: UserProjects,
            required: true,
            where: {
              UserID: req?.current_user?.UserID
            }
          }
        ],
        // Ensures that we get unique workspaces, both created and where the user is a member
        distinct: true
      })

      if (projectList?.length) {
        return response('project-list', req, res, true, 200, 'successProjectList', projectList)
      } else {
        return response('project-list', req, res, true, 202, 'projectListNoData', [])
      }
    } else {
      return response('project-list', req, res, true, 422, 'projectListWorkspaceError', [])
    }
  } catch (error) {
    return response('project-list', req, res, false, 422, 'failedProjectList', null, error)
  }
}

// ** List Project
const listProjectStatus = async (req, res) => {
  try {
    const projectStatus = await ProjectStatus.findAll({ raw: true })

    if (projectStatus?.length) {
      return response('project-status-list', req, res, true, 200, 'successProjectStatusList', projectStatus)
    } else {
      return response('project-status-list', req, res, true, 202, 'projectStatusListNoData', [])
    }
  } catch (error) {
    return response('project-status-list', req, res, false, 422, 'failedProjectStatusList', null, error)
  }
}

// ** List Project
const listProjectPriority = async (req, res) => {
  try {
    const projectPriorities = await ProjectPriority.findAll({ raw: true })

    if (projectPriorities?.length) {
      return response('project-priority-list', req, res, true, 200, 'successProjectPriorityList', projectPriorities)
    } else {
      return response('project-priority-list', req, res, true, 202, 'projectPriorityListNoData', [])
    }
  } catch (error) {
    return response('project-priority-list', req, res, false, 422, 'failedProjectPriorityList', null, error)
  }
}

// ** Add Project
const addProject = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const { ProjectName, WorkspaceID, IsOpen } = req?.body

      const createProject = await Project.create(
        { ProjectName, WorkSpaceID: WorkspaceID, IsDelete: 0, CreateBy: req?.current_user?.UserID, IsOpen },
        { raw: true }
      )

      const userProjectBody = {
        UserID: req?.current_user?.UserID,
        WorkspaceID,
        ProjectID: createProject?.ID,
        RoleID: 1,
        JoinDate: Sequelize.fn('GETDATE'),
        AddedBy: req?.current_user?.UserID
      }

      await UserProjects.create(userProjectBody)

      return response('project-add', req, res, true, 201, 'successProjectAdd', createProject?.dataValues)
    } else {
      return response('project-add', req, res, false, 400, 'failedProjectAdd', null, errors.array())
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

// ** View Project
const viewProject = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const params = req?.params?.id

      const project = await Project.findByPk(params, {
        include: [
          { model: Signup, as: 'CreatedBy', attributes: ['Name', 'Email', 'OrganizationName', 'Address'] },
          {
            model: AdditionalColumnValuesTask,
            include: [{ model: ColumnTypeLookup, as: 'ColumnType' }],
            as: 'additionalColumns',
            where: { IsDelete: 0 },
            required: false // Include task groups even if they don't have additional columns
          }
        ]
      })

      const userProjects = await UserProjects.findOne({
        where: { UserID: req?.current_user?.UserID, ProjectID: params },
        attributes: ['UserProjectID', 'RoleID'],
        include: [{ model: Roles, as: 'Role' }]
      })

      if (!userProjects) {
        return response('project-view', req, res, false, 403, 'projectAccessDenied')
      }

      if (project) {
        return response('project-view', req, res, true, 200, 'successProjectView', {
          ...project?.dataValues,
          userProjects
        })
      }

      return response('project-view', req, res, false, 404, 'projectViewNotFound', project)
    } else {
      throw errors?.array()
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-view', req, res, false, 422, 'failedProjectView', null, error)
  }
}

// ** Update Project
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const params = req?.params?.id
      const body = req?.body

      const update = await Project.update(body, { where: { ID: params } })

      // ** Send Message Through Socket
      sendProjectUpdate(
        params,
        JSON.stringify({ value: 'titleUpdate', by: req?.current_user?.UserID, user: req?.current_user })
      )

      if (update[0]) return response('project-update', req, res, true, 200, 'successProjectUpdate', null)

      return response('project-update', req, res, false, 404, 'projectViewNotFound', null)
    } else {
      throw errors?.array()
    }
  } catch (error) {
    return response('project-update', req, res, false, 422, 'failedProjectUpdate', null, error)
  }
}

// ** Delete Project
const deleteProject = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const params = req?.params?.id

      const project = await Project.update(
        { IsDelete: 1, DeletedBy: req?.current_user?.UserID },
        { where: { ID: params } }
      )

      if (project) {
        return response('project-delete', req, res, true, 200, 'successProjectDelete', project)
      }

      return response('project-delete', req, res, false, 404, 'projectDeleteNotFound', project)
    } else {
      throw errors?.array()
    }
  } catch (error) {
    return response('project-delete', req, res, false, 422, 'failedProjectDelete', null, error)
  }
}

const listUsers = async (req, res) => {
  try {
    const { projectID } = req?.query
    if (projectID) {
      const projectMembers = await UserProjects.findAll({
        where: { ProjectID: projectID },
        include: [
          { model: Signup, as: 'User', attributes: ['Name', 'Email', 'UserID', 'ProfilePicture'] },
          { model: Roles, as: 'Role' }
        ]
      })

      if (projectMembers?.length) {
        return response('project-list', req, res, true, 200, 'successProjectList', projectMembers)
      } else {
        return response('project-list', req, res, true, 202, 'projectListNoData', [])
      }
    } else {
      return response('project-list', req, res, true, 422, 'projectListWorkspaceError', [])
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-list', req, res, false, 422, 'failedProjectList', null)
  }
}

module.exports.projectController = {
  listProject,
  listProjectStatus,
  listProjectPriority,
  addProject,
  viewProject,
  updateProject,
  deleteProject,
  listUsers
}
