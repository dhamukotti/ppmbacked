module.exports = () => {
  // COUNTRY START
  /**
   * @swagger
   * components:
   *  schema:
   *    country:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          description: The status of the request.
   *        statusCode:
   *           type: integer
   *           description: The status code.
   *        data:
   *          type: object
   *          properties:
   *        message:
   *          type: string
   *          description: A feedback message of the request.
   *      example:
   *        status: SUCCESS
   *        statusCode: 200
   *        message: country list found.
   *        data:
   *          id: 1
   *          u_id: LNG1234567
   *          name: 'hindi'
   *          shortcut: 'hi'
   *          rtl: false
   *
   * @swagger
   * /api/country:
   *    get:
   *      summary: List country .
   *      tags: [Country]
   *      responses:
   *        200:
   *          description: The country list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/country"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! country not found
   */
  // COUNTRY END
}
