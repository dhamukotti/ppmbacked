module.exports = () => {
  // PROJECT START
  /**
   * @swagger
   * components:
   *  schema:
   *    project-list:
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
   *        message: Project list found.
   *        data:
   *          ID: 1
   *          ProjectName: "ppm"
   *          CreateDate: 14/05/2024
   *    project-add:
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
   *        message: project list found.
   *        data:
   *          ID: 1
   *          ProjectName: "ppm"
   *          CreateDate: 14/05/2024
   *    project-delete:
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
   *        message: project deleted successfully.
   *        data: {}
   *    project-update:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          description: The status of the request.
   *        statusCode:
   *          type: string
   *          description: The status code
   *        data:
   *          type: object
   *          properties:
   *        message:
   *          type: string
   *          description: A feedback message of the request.
   *      example:
   *        status: SUCCESS
   *        statusCode: 201
   *        message: Successfully project updated
   *        data:
   *          ID: 1
   *          ProjectName: "ppm"
   *          CreateDate: 14/05/2024
   *    project-view:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          description: The status of the request.
   *        statusCode:
   *          type: string
   *          description: The status code
   *        data:
   *          type: array
   *          properties:
   *        message:
   *          type: string
   *          description: A feedback message of the request.
   *      example:
   *        status: SUCCESS
   *        statusCode: 200
   *        message: project view successfully
   *        data:
   *          ID: 1
   *          ProjectName: "ppm"
   *          CreateDate: 14/05/2024
   * */
  /**
   * @swagger
   * /api/project:
   *    get:
   *      summary: List project .
   *      tags: [Projects]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: query
   *          name: workspaceID
   *          schema:
   *            type: number
   *            required: true
   *            description: Workspace ID.
   *      responses:
   *        200:
   *          description: The project list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/project-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! project not found
   */
  /**
   * @swagger
   *  /api/project/{id}:
   *    get:
   *      summary: View project detail by id.
   *      tags: [Projects]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The project id.
   *      responses:
   *        200:
   *          description: Expenses view successfully.
   *          content:
   *            application/json:
   *                    schema:
   *                          $ref: "#/components/schema/project-view"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! project not found
   *        401:
   *          description: Unauthorized.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Access denied
   */
  /**
   * @swagger
   * /api/project:
   *    post:
   *      summary: Add project detail.
   *      tags: [Projects]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                ProjectName:
   *                  type: string
   *                  description: The name of the project.
   *              example:
   *                ProjectName: "ppm"
   *      responses:
   *        201:
   *          description: The project add.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/project-add"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! project not added
   *        401:
   *          description: Unauthorized.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Access denied
   */
  /**
   * @swagger
   * /api/project/{id}:
   *    put:
   *      summary: Update project detail by id.
   *      tags: [Projects]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The project id.
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                ProjectName:
   *                  type: string
   *                  description: The name of the project .
   *              example:
   *                  ProjectName: ppm-update
   *      responses:
   *        201:
   *          description: The user update.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/project-update"
   *        204:
   *          description: Request accepted but processing not completed.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 204
   *                  data: {}
   *                  message: Error! project not found
   *        406:
   *          description: Not Acceptable.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 406
   *                  data: {}
   *                  message: project not updated
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! project not found
   */
  /**
   * @swagger
   * /api/project/{id}:
   *    delete:
   *      summary: Delete project details by id.
   *      tags: [Projects]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The project id.
   *      responses:
   *        200:
   *          description: The project delete.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/project-delete"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! project not deleted
   */
  // PROJECT END
}
