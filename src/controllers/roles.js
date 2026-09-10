const { response } = require('../constants')
const Roles = require('../models/roles')

const roleList = async (req, res) => {
  try {
    const roles = await Roles.findAll()

    return response('roles', req, res, true, 200, 'rolesListSuccess', roles)
  } catch {
    return response('roles', req, res, false, 422, 'rolesListError', null, null)
  }
}

module.exports.rolesController = {
  roleList
}
