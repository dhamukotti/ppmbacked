const { validationResult } = require('express-validator')
const { response } = require('../constants')

/** DB **/
const Organization = require('../models/organization')

// ** List Organizations
const listOrganization = async (req, res) => {
  try {
    const organizationList = await Organization.findAll({ raw: true })

    if (organizationList?.length) {
      return response('organization-list', req, res, true, 200, 'successOrganizationList', organizationList)
    } else {
      return response('organization-list', req, res, true, 202, 'organizationListNoData', [])
    }
  } catch (error) {
    return response('organization-list', req, res, false, 422, 'failedOrganizationList', null, error)
  }
}

// ** Add Organization API
const addOrganization = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const { OrganizationName, CountryID } = req?.body

      const createOrganization = await Organization.create({ OrganizationName, CountryID }, { raw: true })

      return response('organization-add', req, res, true, 201, 'successOrganizationAdd', createOrganization?.dataValues)
    } else {
      return response('organization-add', req, res, false, 400, 'failedOrganizationAdd', null, errors.array())
    }
  } catch (error) {
    return response('organization-add', req, res, false, 422, 'failedOrganizationAdd', null, error)
  }
}

// ** Update Organization
const updateOrganization = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const params = req?.params?.id
      const body = req?.body

      await Organization.update(body, { where: { OrganizationID: params } })

      return response('organization-update', req, res, true, 200, 'successOrganizationUpdate', null)
    } else {
      throw errors?.array()
    }
  } catch (error) {
    return response('organization-update', req, res, false, 422, 'failedOrganizationUpdate', null, error)
  }
}

module.exports.organizationController = { listOrganization, addOrganization, updateOrganization }
