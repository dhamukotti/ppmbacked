module.exports = () => {
  // COLUMN TYPE LOOKUP START
  /**
   * @swagger
   * components:
   *  schema:
   *    column-type:
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
   *        message: Fetched Column Types successfully.
   *
   * @swagger
   * /api/column-type:
   *    get:
   *      summary: List Column Type.
   *      tags: [Column Type Lookup]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: Fetch Column Types.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/column-type"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to fetch column types!
   */
  // COLUMN TYPE LOOKUP END
}
