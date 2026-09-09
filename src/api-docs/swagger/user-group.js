module.exports = () => {
  // USER GROUP START
  /**
   * @swagger
   * components:
   *  schema:
   *    user-group:
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
   *        message: Invited user successfully.
   *
   * @swagger
   * /api/user-group:
   *    get:
   *      summary: Get User Group.
   *      tags: [User Group]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: Get User Group.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/user-group"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to create user group
   * @swagger
   * /api/user-group:
   *    post:
   *      summary: Create User Group.
   *      tags: [User Group]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  description: The name of the project.
   *                organizationID:
   *                  type: int
   *                  description: The name of the project.
   *              example:
   *                email: "ppm@example.com"
   *                organizationID: 3
   *      responses:
   *        200:
   *          description: Create User Group.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/user-group"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to create user group
   */
  // USER GROUP END
}
