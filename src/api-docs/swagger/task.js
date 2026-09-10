module.exports = () => {
  // TASKS START
  /**
   * @swagger
   * components:
   *  schema:
   *    task-list:
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
   *        message: Task list found.
   *        data:
   *          TaskID: 1
   *          Taskname: "ppm"
   *          CreateDate: 14/05/2024
   *    task-add:
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
   *        message: Task Added Successfully.
   *        data:
   *          TaskID: 1
   *          Taskname: "ppm"
   *          CreateDate: 14/05/2024
   *    task-delete:
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
   *        message: Task deleted successfully.
   *        data: {}
   *    task-update:
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
   *        message: Task updated successfully
   *        data:
   *          TaskID: 1
   *          Taskname: "ppm-update"
   *          CreateDate: 14/05/2024
   *    task-view:
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
   *        message: task found
   *        data:
   *          TaskID: 1
   *          Taskname: "ppm"
   *          CreateDate: 14/05/2024
   * */
  /**
   * @swagger
   * /api/task:
   *    get:
   *      summary: List tasks .
   *      tags: [Task]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: query
   *          name: taskGroupID
   *          schema:
   *            type: number
   *            required: false
   *            description: Task Group ID to list tasks.
   *        - in: query
   *          name: projectID
   *          schema:
   *            type: number
   *            required: false
   *            description: Project ID to list tasks.
   *        - in: query
   *          name: search
   *          schema:
   *            type: string
   *            required: false
   *            description: Search by name, task id.
   *      responses:
   *        200:
   *          description: The task list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task not found
   */
  /**
   * @swagger
   * /api/task:
   *    post:
   *      summary: Add task detail.
   *      tags: [Task]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                taskGroupID:
   *                  type: number
   *                  description: Id of taskgroup.
   *              example:
   *                taskGroupID: 2
   *                Taskname: 'Task Two'
   *                StatusID: 2
   *                PriorityID: null
   *      responses:
   *        201:
   *          description: The task add.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-add"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task not added
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
   * /api/task/{id}:
   *    put:
   *      summary: Update task detail by id.
   *      tags: [Task]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: number
   *            required: true
   *            description: The task id.
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              example:
   *                Taskname: 'Task Update'
   *                StatusID: 3
   *                PriorityID: 2
   *      responses:
   *        201:
   *          description: The task update.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-update"
   *        204:
   *          description: Request accepted but processing not completed.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 204
   *                  data: {}
   *                  message: Error! task not found
   *        406:
   *          description: Not Acceptable.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 406
   *                  data: {}
   *                  message: Failed to update task
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to update task
   */
  /**
   * @swagger
   * /api/task/{id}:
   *    delete:
   *      summary: Delete task details by id.
   *      tags: [Task]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: TaskID
   *          schema:
   *            type: number
   *            required: true
   *            description: The task id.
   *      responses:
   *        200:
   *          description: The task delete.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-delete"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task not deleted
   */
  /**
   * @swagger
   * /api/task-delete-mulitple:
   *    delete:
   *      summary: Delete task details by id.
   *      tags: [Task]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                taskIds:
   *                  type: array
   *                  description: array of TaskIDs.
   *              example:
   *                taskIds: [2,3,4]
   *      responses:
   *        200:
   *          description: The task delete.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/task-delete"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! task not deleted
   */
  // TASKS END
}
