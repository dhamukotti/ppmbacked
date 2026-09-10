module.exports = () => {
  // INVITE USER START
  /**
   * @swagger
   * components:
   *  schema:
   *    invite-user:
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
   * /api/invite-user:
   *    post:
   *      summary: Invite User.
   *      tags: [Invite]
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
   *          description: Invite user.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/invite-user"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to invite user!
   */
  // INVITE USER END
}
