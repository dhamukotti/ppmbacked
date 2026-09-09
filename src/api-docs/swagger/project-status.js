module.exports = () => {
  // PROJECT PRIORITY START
  /**
   * @swagger
   * components:
   *  schema:
   *    project-status-list:
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
   *        message: Status list found.
   *        data:
   *          StatusID: 1
   *          StatusName: "Done"
   *          CreateDate: 14/05/2024
   * */
  /**
   * @swagger
   * /api/project-status:
   *    get:
   *      summary: List priorities item .
   *      tags: [Project Status]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: The priority list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/project-status-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! priority not found
   *        401:
   *          description: Access Denied.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Invalid Token
   */
  /**
   * @swagger
   * /api/project-status:
   *    post:
   *      summary: Add Project Status .
   *      tags: [Project Status]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                StatusName:
   *                  type: string
   *                  description: name of status-label.
   *                Colorcode:
   *                  type: string
   *                  description: hexcode.
   *                TaskgroupID:
   *                  type: int
   *                  description: taskgroup id.
   *              example:
   *                  StatusName: Do later
   *                  Colorcode: #ffffff
   *                  TaskgroupID: 22
   *      responses:
   *        202:
   *          description: status added.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 202
   *                  data: {}
   *                  message: Status Added successfully
   *        401:
   *          description: Access Denied.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Invalid Token
   */
  /**
   * @swagger
   * /api/project-status/{id}:
   *    delete:
   *      summary: Delete Project Status .
   *      tags: [Project Status]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The project status id.
   *      responses:
   *        200:
   *          description: status deleted.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 200
   *                  data: {}
   *                  message: Status deleted successfully
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! status not deleted
   *        401:
   *          description: Access Denied.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Invalid Token
   */
  // PROJECT PRIORITY END
}
