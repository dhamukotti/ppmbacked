const { response } = require('../constants')
const Country = require('../models/country')
const Signup = require('../models/signup')
const { sequelize } = require('../db-connection')
const { uploadToFTP } = require('../ftp-connection')
const RecentActivity = require('../models/recent-activity')
const Workspace = require('../models/workspace')
const { Op } = require('sequelize')
const UserProjects = require('../models/user-project')
const TaskMaster = require('../models/task-master')
const Project = require('../models/project')
const { generateOTP } = require('../utils')
const moment = require('moment')
const { Recipient, EmailParams, MailerSend, Sender } = require('mailersend')

const mailerSend = new MailerSend({
  apiKey: process.env.MAIL_TOKEN
})

const sentFrom = new Sender('info@projectpulse360.com', 'ProjectPlus360')

// ** Turn logs on
const showLogs = true

// ** User Profile
const getUserProfile = async (req, res) => {
  try {
    if (req?.current_user?.UserID) {
      const profileData = await Signup.findByPk(req?.current_user?.UserID, {
        attributes: ['Name', 'UserID', 'Email', 'Address', 'ProfilePicture'],
        include: [{ model: Country }]
      })

      return response('profile', req, res, true, 200, 'userProfileSuccess', profileData)
    } else {
      return response('profile', req, res, false, 404, 'userProfileNotFound', [])
    }
  } catch (error) {
    showLogs && console.error('USER PROFILE ERROR :', error)

    return response('profile', req, res, true, 422, 'userProfileError', null)
  }
}

// ** User Profile
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return response('forgot-password', req, res, false, 400, 'forgotPasswordEmailNotProvided', null)
    }

    // Check if the user exists
    const user = await Signup.findOne({ where: { email } })
    if (!user) {
      return response('forgot-password', req, res, false, 404, 'forgotPasswordUserNotFound', null)
    }

    // Generate a 6-digit OTP
    const otp = generateOTP()

    // Set expiration time (5 minutes from now)
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

    const addOTP = await Signup.update(
      { ResetOTP: otp, OtpExpireAt: moment(otpExpiresAt).unix() },
      { where: { UserID: user?.UserID } }
    )

    if (!addOTP) {
      throw Error('Failed to add')
    }

    if (process?.env?.NODE_ENV !== 'development') {
      const recipients = [new Recipient(email)]

      const logoUrl = `${req.protocol}://${req.get('host')}/public/images/logo/logo-pp-dark.png`

      const htmlContent = `
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #121212; color: #f0f0f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #1e1e1e;">
        <div style="text-align: center; padding: 20px; background-color: #252525; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <img src="${logoUrl}" alt="ProjectPlus360" style="width: 150px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #4caf50; text-align: center;">Your One-Time Password (OTP) for ProjectPlus360</h2>
        <p style="color: #cccccc;">Hi there,</p>
        <p style="color: #cccccc;">You requested to reset your password or authenticate on <strong>ProjectPlus360</strong>.</p>
        <p style="color: #cccccc;">Please use the following OTP to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
        <p style="font-size: 24px; font-weight: bold; color: #4caf50;">${otp}</p>
        </div>
        <p style="color: #999999;">If you didn’t request this OTP, please ignore this email.</p>
        <p style="color: #999999; text-align: center;">Best regards,<br>ProjectPlus360 Team</p>
      </div>
    </body>
    </html>
    `

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject('Your OTP for ProjectPlus360')
        .setHtml(htmlContent)
        .setText(
          `Hi there, your OTP for ProjectPlus360 is: ${otp}. If you didn’t request this, please ignore this email.`
        )

      await mailerSend?.email.send(emailParams)
    }

    return response('forgot-password', req, res, true, 200, 'forgotPasswordSuccess', { otp })
  } catch (error) {
    showLogs && console.error('forgotPassword ERROR :', error)

    return response('forgot-password', req, res, false, 422, 'forgotPasswordFailed', null)
  }
}
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body // Extract email and OTP from the request body

    // Validate request body
    if (!email || !otp) {
      return response('verify-otp-password', req, res, false, 400, 'verifyOTPInvalidRequest', {
        message: 'Email and OTP are required'
      })
    }

    // Find the user by email
    const user = await Signup.findOne({ where: { email } })

    if (!user) {
      return response('verify-otp-password', req, res, false, 404, 'verifyOTPUserNotFound', {
        message: 'User not found'
      })
    }

    // Check if OTP matches and is not expired
    const currentTimestamp = moment().unix() // Current time in UNIX timestamp (seconds)

    if (user.ResetOTP !== Number(otp)) {
      return response('verify-otp-password', req, res, false, 400, 'verifyOTPInvalidOTP', {
        message: 'The OTP is incorrect'
      })
    }

    if (user.OtpExpireAt < currentTimestamp) {
      return response('verify-otp-password', req, res, false, 400, 'verifyOTPExpired', {
        message: 'The OTP has expired'
      })
    }

    // If OTP is valid, clear the OTP fields from the database
    await Signup.update(
      {
        ResetOTP: null,
        OtpExpireAt: null
      },
      {
        where: { email }
      }
    )

    // Respond with success
    return response('verify-otp-password', req, res, true, 200, 'verifyOTPPasswordSuccess', {
      message: 'OTP verified successfully'
    })
  } catch (error) {
    showLogs && console.error('verifyOTPPassword ERROR :', error)

    return response('verify-otp-password', req, res, false, 500, 'verifyOTPPasswordFailed', {
      message: 'Internal server error'
    })
  }
}

// ** User Profile
const updatePassword = async (req, res) => {
  try {
    const { email, password } = req?.body
    const user = await Signup.findOne({ where: { email } })
    if (user) {
      await sequelize.query('EXEC SPC_UpdatePassword @UserID = :userID, @NewPwd = :password', {
        type: sequelize?.QueryTypes?.SELECT,
        replacements: {
          userID: user?.UserID,
          password
        },
        raw: true
      })

      return response('update-password', req, res, true, 200, 'userUpdatePwdSuccess')
    } else {
      return response('update-password', req, res, false, 404, 'userUpdatePwdNotFound', [])
    }
  } catch (error) {
    showLogs && console.error('USER PROFILE ERROR :', error)

    return response('update-password', req, res, true, 422, 'userUpdatePwdError', null)
  }
}

// ** User Profile
const changePassword = async (req, res) => {
  try {
    if (req?.current_user?.UserID) {
      await sequelize.query('EXEC SPC_UpdatePassword @UserID = :userID, @NewPwd = :password', {
        type: sequelize?.QueryTypes?.SELECT,
        replacements: {
          userID: req?.current_user?.UserID,
          password: req?.body?.password
        },
        raw: true
      })

      return response('profile', req, res, true, 200, 'userChangePwdSuccess')
    } else {
      return response('profile', req, res, false, 404, 'userChangePwdNotFound', [])
    }
  } catch (error) {
    showLogs && console.error('USER PROFILE ERROR :', error)

    return response('profile', req, res, true, 422, 'userChangePwdError', null)
  }
}

// ** User Profile
const profileUpdate = async (req, res) => {
  try {
    if (req?.current_user?.UserID) {
      const profilePicture = req?.files?.ProfilePicture
      if (profilePicture) {
        const filePath = await uploadToFTP(profilePicture, '/appsure.co.in/PPMProfilepic')

        if (filePath) {
          req.body.ProfilePicture = `https:/${filePath}`
        }
      }
      const profileData = await Signup.update(req?.body, {
        where: { UserID: req?.current_user?.UserID }
      })

      return response('profile', req, res, true, 200, 'userProfileSuccess', profileData)
    } else {
      return response('profile', req, res, false, 404, 'userProfileNotFound', [])
    }
  } catch (error) {
    showLogs && console.error('USER PROFILE ERROR :', error)

    return response('profile', req, res, true, 422, 'userProfileError', null)
  }
}

const recentActivity = async (req, res) => {
  try {
    if (req?.current_user?.UserID) {
      const UserID = req?.current_user?.UserID

      // Fetch user's projects
      const userProjects = await UserProjects.findAll({
        where: { UserID },
        attributes: ['ProjectID', 'WorkspaceID']
      })

      const projectIDs = userProjects.map(up => up.ProjectID)

      // Fetch 3 unique projects with recent activities
      const projectsWithActivities = await Project.findAll({
        where: { ID: { [Op.in]: projectIDs } },
        attributes: {
          exclude: ['WorkspaceID'] // Exclude WorkspaceID to avoid duplicates
        },
        include: [
          {
            model: TaskMaster,
            attributes: [], // Do not include TaskMaster columns
            include: [
              {
                model: RecentActivity,
                attributes: [], // Do not include RecentActivity columns
                required: true
              }
            ]
          },
          {
            model: Workspace,
            as: 'workspace',
            attributes: ['WorkspaceName'] // Include specific columns you need
          }
        ],
        limit: 3
      })

      // Fetch 3 unique workspaces
      const myWorkspaces = await Workspace.findAll({
        where: {
          WorkspaceID: { [Op.in]: userProjects.map(up => up.WorkspaceID) }
        },
        limit: 3
      })

      // Fetch 5 recent activities in any project the user is part of
      const recentActivities = await RecentActivity.findAll({
        where: {
          TaskMasterID: {
            [Op.in]: await TaskMaster.findAll({
              where: { ProjectID: { [Op.in]: projectIDs } },
              attributes: ['TaskID']
            }).then(tasks => tasks.map(task => task.TaskID))
          }
        },
        include: [{ model: Signup, as: 'doneBy', attributes: ['Name', 'Email'] }],
        order: [['DoneAt', 'DESC']],
        limit: 5
      })

      const responseBody = {
        recentlyVisited: projectsWithActivities,
        myWorkspaces,
        recentActivities
      }

      return response('profile', req, res, true, 200, 'recentActivityFindSuccess', responseBody)
    } else {
      return response('profile', req, res, false, 404, 'recentActivityNotFound', [])
    }
  } catch (error) {
    showLogs && console.error('USER PROFILE ERROR :', error)

    return response('profile', req, res, true, 422, 'recentActivityError', null)
  }
}

module.exports.userController = {
  getUserProfile,
  forgotPassword,
  verifyOTP,
  updatePassword,
  changePassword,
  profileUpdate,
  recentActivity
}
