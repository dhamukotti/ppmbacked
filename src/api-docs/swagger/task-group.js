module.exports = () => {
  // TASK GROUP START
  /**
   * @swagger
   * components:
   *  schema:
   *    task-group-list:
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
   *          groupName: "ppm"
   *          CreateDate: 14/05/2024
   *    task-group-add:
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
   *        message: task-group list found.
   *        data:
   *          ID: 1
   *          groupName: "ppm"
   *          CreateDate: 14/05/2024
   *    task-group-delete:
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
   *        message: task-group deleted successfully.
   *        data: {}
   *    task-group-update:
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
   *        message: Successfully task-group updated
   *        data:
   *          ID: 1
   *          groupName: "ppm"
   *          CreateDate: 14/05/2024
   *    task-group-view:
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
   *        message: task-group view successfully
   *        data:
   *          ID: 1
   *          groupName: "ppm"
   *          CreateDate: 14/05/2024
   * */
  /**
   * @swagger
   * /api/task-group:
   *    get:
   *      summary: List task-group .
   *      tags: [Task Group]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: query
   *          name: projectID
   *          schema:
   *            type: number
   *            required: true
   *            description: Project ID.
   *      responses:
   *        200:
   *          description: The task-group list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-group-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task-group not found
   */
  /**
   * @swagger
   * /api/task-group:
   *    post:
   *      summary: Add task-group detail.
   *      tags: [Task Group]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                groupName:
   *                  type: string
   *                  description: The name of the task-group.
   *                projectID:
   *                  type: number
   *                  description: project id
   *              example:
   *                groupName: "ppm"
   *                projectID: 3
   *      responses:
   *        201:
   *          description: The task-group add.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-group-add"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task-group not added
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
   * /api/task-group/{id}:
   *    put:
   *      summary: Update task-group detail by id.
   *      tags: [Task Group]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The task-group id.
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                groupName:
   *                  type: string
   *                  description: The name of the task-group .
   *              example:
   *                  groupName: ppm-update
   *      responses:
   *        201:
   *          description: The user update.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-group-update"
   *        204:
   *          description: Request accepted but processing not completed.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 204
   *                  data: {}
   *                  message: Error! task-group not found
   *        406:
   *          description: Not Acceptable.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 406
   *                  data: {}
   *                  message: task-group not updated
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task-group not found
   */
  /**
   * @swagger
   * /api/task-group/{id}:
   *    delete:
   *      summary: Delete task-group details by id.
   *      tags: [Task Group]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The task-group id.
   *      responses:
   *        200:
   *          description: The task-group delete.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-group-delete"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task-group not deleted
   */
  /**
   * @swagger
   * /api/create-column:
   *    post:
   *      summary: Create dynamic column
   *      tags: [Task Group]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                columnName:
   *                  type: string
   *                  description: Give column a label
   *                columnTypeID:
   *                  type: number
   *                  description: Id of column type
   *                taskGroupID:
   *                  type: number
   *                  description: Task Group ID
   *                workspaceID:
   *                  type: number
   *                  description: Workspace ID
   *                projectID:
   *                  type: number
   *                  description: Project ID
   *              example:
   *                columnName: "Effort Done"
   *                columnTypeID: 3
   *                taskGroupID: 3
   *                workspaceID: 3
   *                projectID: 3
   *      responses:
   *        201:
   *          description: Create Dynamic Column.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 201
   *                  data: {}
   *                  message: Column Added successfully
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! column not created
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
  // TASK GROUP END
}
