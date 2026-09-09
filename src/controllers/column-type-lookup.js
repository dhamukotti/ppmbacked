const { response } = require('../constants')
const { sequelize } = require('../db-connection')

const showLogs = false

const list = async (req, res) => {
  try {
    const lookupColumns = await sequelize.query('EXEC spc_GetColumnTypeLookup', {
      type: sequelize?.QueryTypes?.EXEC,
      raw: true
    })

    if (lookupColumns?.length !== 0) {
      return response('column-type-lookup-list', req, res, true, 200, 'taskGroupListFound', lookupColumns?.[0])
    }

    return response('column-type-lookup-list', req, res, true, 202, 'taskGroupListFound', [])
  } catch (error) {
    showLogs && console.log('ERROR : => : list :', error)

    return response('column-type-lookup-list', req, res, false, 422, 'additionalColumnCreateError', null, error)
  }
}

module.exports.columnTypeLookup = {
  list
}
