const { validationResult } = require('express-validator')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')
const { Recipient, EmailParams, MailerSend, Sender } = require('mailersend')
const InviteMgt = require('../models/invite-management')
const Project = require('../models/project')
const UserProjects = require('../models/user-project')
const { Sequelize } = require('@sequelize/core')
const { verify, sign } = require('jsonwebtoken')
const Signup = require('../models/signup')

const mailerSend = new MailerSend({
  apiKey: process.env.MAIL_TOKEN
})

const sentFrom = new Sender('info@projectpulse360.com', 'ProjectPlus360')

const showLogs = true

const projectAction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { command, projectName, projectID = null, workspaceID } = req?.body
      const procedure = await sequelize.query(
        'EXEC spc_ProjectMgt @Command = :command, @ProjectName = :projectName, @CreateBy = :createBy, @ProjectID = :projectID, @WorkspaceID = :workspaceID, @DeleteBy = :deletedBy, @UpdateBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command,
            projectName,
            projectID,
            workspaceID,
            createBy: req?.current_user?.UserID,
            deletedBy: req?.current_user?.UserID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      const executed = procedure?.[0]

      if (executed.Code === 6001) {
        return response('projectMng', req, res, false, 400, 'projectMngValidationInvalidCommandError', null, null)
      } else if (executed.Code === 5999) {
        return response('projectMng', req, res, true, 200, 'projectMngSuccess')
      } else {
        return response('projectMng', req, res, false, 400, 'projectMngValidationError', null, executed ?? null)
      }
    } else {
      return response('projectMng', req, res, false, 400, 'projectMngValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : projectAction :', error)

    return response('projectMng', req, res, false, 422, 'projectMngActionFailed', null, error)
  }
}

const taskAction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { command, groupName, projectID, taskGroupID = null } = req?.body
      const procedure = await sequelize.query(
        'EXEC spc_TaskGroupMgt @Command = :command, @Groupname = :groupName, @CreateBy = :createBy, @ProjectID = :projectID, @TaskGroupID = :taskGroupID, @DeletedBy = :deletedBy, @UpdateBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command,
            groupName,
            projectID,
            taskGroupID,
            createBy: req?.current_user?.UserID,
            deletedBy: req?.current_user?.UserID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      const executed = procedure?.[0]

      if (executed.Code === 6001) {
        return response('projectMng', req, res, false, 400, 'projectMngValidationInvalidCommandError', null, null)
      } else if (executed.Code === 5999) {
        return response('projectMng', req, res, true, 200, 'projectMngSuccess')
      } else {
        return response('projectMng', req, res, false, 400, 'projectMngValidationError', null, executed ?? null)
      }
    } else {
      return response('projectMng', req, res, false, 400, 'projectMngValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : taskAction :', error)

    return response('projectMng', req, res, false, 422, 'projectMngActionFailed', null, error)
  }
}

const inviteUserAction = async (req, res) => {
  const transaction = await sequelize.startUnmanagedTransaction() // Start an unmanaged transaction
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { invitations, projectID, workspaceID } = req?.body
      const responseData = {}

      for (let i = 0; i < invitations.length; i++) {
        const invitedUser = invitations[i]

        const findInvitation = await InviteMgt.findOne({
          where: {
            InvitedEmailaddress: invitedUser?.email?.toUpperCase(),
            WorkspaceID: workspaceID,
            ProjectID: projectID
          },
          transaction // Use the transaction
        })

        if (!findInvitation && req?.current_user?.Email?.toUpperCase() !== invitedUser?.email?.toUpperCase()) {
          const executed = await InviteMgt.create(
            {
              InvitedEmailaddress: invitedUser?.email?.toUpperCase(),
              InvitedDate: Sequelize.fn('GETDATE'),
              InvitedBy: req?.current_user?.UserID,
              WorkspaceID: workspaceID,
              ProjectID: projectID,
              RoleID: invitedUser?.roleID
            },
            { transaction } // Use the transaction
          )

          if (executed?.ID) {
            const recipients = [new Recipient(invitedUser?.email)]

            const logoUrl = `${req.protocol}://${req.get('host')}/public/images/logo/logo-pp-dark.png`
            const inviteLink = `${process?.env?.CLIENT_URL}/invite?invitation_id=${executed?.ID}`
            console.log('inviteLink :', inviteLink)

            if (process.env?.NODE_ENV !== 'development') {
              const htmlContent = `
              <html>
              <body style="font-family: Arial, sans-serif; background-color: #121212; color: #f0f0f0; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #1e1e1e;">
                  <div style="text-align: center; padding: 20px; background-color: #252525; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="${logoUrl}" alt="ProjectPlus360" style="width: 150px; margin-bottom: 20px;">
                  </div>
                  <h2 style="color: #4caf50; text-align: center;">You're Invited to Join a Project on ProjectPlus360!</h2>
                  <p style="color: #cccccc;">Hi there,</p>
                  <p style="color: #cccccc;">Someone from our team has invited you to collaborate on a project on <strong>ProjectPlus360</strong>.</p>
                  <p style="color: #cccccc;">To join, please click the link below:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${inviteLink}" 
                       style="background-color: #4caf50; color: #ffffff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                       Accept Invitation
                    </a>
                  </div>
                  <p style="color: #999999;">If you didn’t expect this invitation, you can ignore this email.</p>
                  <p style="color: #999999; text-align: center;">Best regards,<br>ProjectPlus360 Team</p>
                </div>
              </body>
              </html>
              `

              const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject('You’re Invited to ProjectPlus360')
                .setHtml(htmlContent)
                .setText(
                  'You have been invited to join a project on ProjectPlus360. Click the link to accept your invitation.'
                )

              await mailerSend?.email.send(emailParams)

              console.log('~~~~~~ EMAIL SENT SUCCESSFULLY ~~~~~~ ')
            } else {
              responseData.inviteLink = inviteLink
            }
          } else {
            throw new Error('Invitation creation failed')
          }
        }
      }

      await transaction.commit() // Commit transaction if all operations succeed

      return response('inviteUserMng', req, res, true, 200, 'inviteUserMngSuccess', responseData)
    } else {
      return response('inviteUserMng', req, res, false, 400, 'inviteUserMngValidationError', errors?.array())
    }
  } catch (error) {
    await transaction.rollback() // Rollback transaction in case of any error
    console.error('Error : => : inviteUserAction :', error)

    return response('inviteUserMng', req, res, false, 422, 'inviteUserMngActionFailed', null, error)
  }
}

const getInvitation = async (req, res) => {
  try {
    if (!req?.params?.id) {
      throw Error('InvitationID Not Found')
    }

    const invitation = await InviteMgt.findByPk(req?.params?.id)

    return response('get-invite', req, res, true, 200, 'acceptInvitationFailed', invitation)
  } catch (error) {
    console.log('error :', error)

    return response('get-invite', req, res, false, 422, 'getInvitationFailed', null, error)
  }
}

const acceptInvitation = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      // 2. Check if the project is open or locked
      const invitedProject = await Project.findOne({ where: { ID: req?.invitation?.ProjectID } })
      if (!invitedProject) {
        return response('accept-invite', req, res, false, 404, 'acceptInvitationProjectNotFound', null)
      }

      const isProjectOpen = invitedProject?.IsOpen

      // 3. Fetch all open projects in the workspace
      const openProjects = await Project.findAll({
        where: {
          WorkSpaceID: req?.invitation?.WorkspaceID,
          IsOpen: 1
        }
      })

      // 4. Determine projects to add the user to
      const projectsToAdd = openProjects.map(p => p?.ID)

      if (!isProjectOpen) {
        projectsToAdd.push(req?.invitation?.ProjectID)
      }

      // 5. Check existing entries in UserProjects to avoid duplicates
      const existingUserProjects = await UserProjects.findAll({
        where: {
          UserID: req?.current_user?.UserID,
          WorkspaceID: req?.invitation?.WorkspaceID,
          ProjectID: projectsToAdd // Check all relevant projects at once
        },
        attributes: ['ProjectID'] // Only retrieve the projectId field to check existence
      })

      const existingProjectIds = new Set(existingUserProjects.map(up => up.ProjectID))

      // 6. Filter out projects the user is already a member of
      const newProjectsToAdd = projectsToAdd.filter(projId => !existingProjectIds.has(projId))

      // 7. Insert the user into UserProjects for each selected project
      const userProjectsData = newProjectsToAdd.map(projId => ({
        UserID: req?.current_user?.UserID,
        WorkspaceID: req?.invitation?.WorkspaceID,
        ProjectID: projId,
        RoleID: req?.invitation?.RoleID, // Assuming roleId is assigned in the invite
        JoinDate: Sequelize.fn('GETDATE'),
        AddedBy: req?.invitation.InvitedBy
      }))

      if (userProjectsData.length > 0) {
        await UserProjects.bulkCreate(userProjectsData)
      }

      // 8. Update the invitation status to accepted
      await InviteMgt.update(
        {
          Status: 'Accepted',
          InviteAcceptedDate: Sequelize.fn('GETDATE')
        },
        { where: { ID: req?.invitation?.ID } }
      )

      return response('accept-invite', req, res, true, 200, 'acceptInvitationSuccess', {
        projectID: req?.invitation?.ProjectID
      })
    } else {
      return response('accept-invite', req, res, false, 422, 'acceptInviteValidation', null)
    }
  } catch (error) {
    showLogs && console.log('Error : => : acceptInvitation :', error)

    return response('accept-invite', req, res, false, 422, 'acceptInvitationFailed', null, error)
  }
}

const registrationOnInvite = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { invitationID, fullName, password, latitude, longitude } = req?.body

      const findInvitation = await InviteMgt.findByPk(invitationID)

      if (!findInvitation) {
        return response('register-invite', req, res, false, 400, 'registerInviteNotFound', null)
      }

      if (findInvitation?.InviteAcceptedDate) {
        return response('register-invite', req, res, false, 204, 'registerInviteAlreadyAccepted', null)
      }

      const checkUser = await Signup.findOne({ where: { Email: findInvitation?.InvitedEmailaddress } })

      if (checkUser) {
        return response('register-invite', req, res, false, 204, 'registerInviteAlreadyRegistered', null)
      }

      const createdUser = await sequelize.query(
        'EXEC SPC_signup @Name = :Name, @EmailAddress = :EmailAddress, @Password = :Password, @Source = :Source, @CountryID = :CountryID, @Latitude = :Latitude, @Longtitude = :Longitude, @OrganizationName = :OrganizationName, @Organizationsize = :OrganizationSize, @Address = :Address',
        {
          type: sequelize.QueryTypes.SELECT,
          row: true,
          replacements: {
            Name: fullName ?? null,
            EmailAddress: findInvitation?.InvitedEmailaddress ?? null,
            Password: password,
            Source: null,
            CountryID: null,
            Latitude: latitude ?? null,
            Longitude: longitude ?? null,
            OrganizationName: null,
            OrganizationSize: null,
            Address: null
          }
        }
      )
      if (createdUser?.[0]?.Code === 6000) {
        return response('sign_up', req, res, false, 422, 'failedSignup', null)
      }
      if (createdUser?.[0]?.Code === 6999) {
        return res.status(422).send({ status: false, statusCode: 422, message: createdUser?.[0]?.Message, data: null })
      }

      const responseObj = { ...req.body }
      delete responseObj.password

      const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'
      const refreshTokenSecretKey = process.env.REFRESH_JWT || 'secretOrPrivateKey'

      const token = sign({ email: findInvitation?.InvitedEmailaddress }, secretKey, {
        expiresIn: '24h'
      })

      const refreshToken = sign(
        {
          email: findInvitation?.InvitedEmailaddress
        },
        refreshTokenSecretKey,
        {
          expiresIn: '365d'
        }
      )

      const tokenTime = verify(token, secretKey)
      const refreshTokenTime = verify(refreshToken, refreshTokenSecretKey)

      responseObj.token = token
      responseObj.tokenTime = tokenTime?.exp
      responseObj.refreshToken = refreshToken
      responseObj.refreshTokenTime = refreshTokenTime?.exp

      const user = await Signup.findOne({ where: { Email: findInvitation?.InvitedEmailaddress } })

      responseObj.userData = user

      // 2. Check if the project is open or locked
      const invitedProject = await Project.findOne({ where: { ID: findInvitation?.ProjectID } })
      if (!invitedProject) {
        return response('accept-invite', req, res, false, 404, 'acceptInvitationProjectNotFound', null)
      }

      const isProjectOpen = invitedProject?.IsOpen

      // 3. Fetch all open projects in the workspace
      const openProjects = await Project.findAll({
        where: {
          WorkSpaceID: findInvitation?.WorkspaceID,
          IsOpen: 1
        }
      })

      // 4. Determine projects to add the user to
      const projectsToAdd = openProjects.map(p => p?.ID)

      if (!isProjectOpen) {
        projectsToAdd.push(findInvitation?.ProjectID)
      }

      // 5. Check existing entries in UserProjects to avoid duplicates
      const existingUserProjects = await UserProjects.findAll({
        where: {
          UserID: user?.UserID,
          WorkspaceID: findInvitation?.WorkspaceID,
          ProjectID: projectsToAdd // Check all relevant projects at once
        },
        attributes: ['ProjectID'] // Only retrieve the projectId field to check existence
      })

      const existingProjectIds = new Set(existingUserProjects.map(up => up.ProjectID))

      // 6. Filter out projects the user is already a member of
      const newProjectsToAdd = projectsToAdd.filter(projId => !existingProjectIds.has(projId))

      // 7. Insert the user into UserProjects for each selected project
      const userProjectsData = newProjectsToAdd.map(projId => ({
        UserID: user?.UserID,
        WorkspaceID: findInvitation?.WorkspaceID,
        ProjectID: projId,
        RoleID: findInvitation?.RoleID, // Assuming roleId is assigned in the invite
        JoinDate: Sequelize.fn('GETDATE'),
        AddedBy: findInvitation.InvitedBy
      }))

      if (userProjectsData.length > 0) {
        await UserProjects.bulkCreate(userProjectsData)
      }

      // 8. Update the invitation status to accepted
      await InviteMgt.update(
        {
          Status: 'Accepted',
          InviteAcceptedDate: Sequelize.fn('GETDATE')
        },
        { where: { ID: findInvitation?.ID } }
      )

      responseObj.projectID = findInvitation?.ProjectID

      return response('register-invite', req, res, true, 201, 'registerInviteSuccess', responseObj)
    } else {
      return response('register-invite', req, res, false, 422, 'registerInviteValidation', null)
    }
  } catch (error) {
    showLogs && console.log('Error : => : registerInvitation :', error)

    return response('register-invite', req, res, false, 422, 'registerInvitationFailed', null, error)
  }
}

module.exports.workspaceController = {
  projectAction,
  taskAction,
  inviteUserAction,
  getInvitation,
  acceptInvitation,
  registrationOnInvite
}
