module.exports = () => {
  // Sprint TASK API START
  /**
   * @swagger
   * components:
   *  schema:
   *    sprint-task-list:
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
   *        message: Tasks found successfully.
   *
   * @swagger
   * /api/sprint-tasks:
   *    get:
   *      summary: List of Tasks in a sprint.
   *      tags: [Sprint Task Management]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: query
   *          name: sprintID
   *          schema:
   *            type: number
   *            required: true
   *            description: Sprint ID.
   *      responses:
   *        200:
   *          description: List of tasks of user.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/sprint-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to get list of tasks!
   */
  /**
   * @swagger
   * /api/sprint-tasks/{id}:
   *   get:
   *     summary: Get Tasks by ID
   *     tags: [Sprint Task Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The Task ID
   *     responses:
   *       200:
   *         description: Tasks details retrieved
   *       404:
   *         description: Task not found
   */
  /**
   * @swagger
   * /api/sprint-tasks:
   *   post:
   *     summary: Create a new task in a sprint
   *     tags: [Sprint Task Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                  description: The name of the sprint.
   *                sprintID:
   *                  type: integer
   *                  description: SprintID.
   *              example:
   *                name: "New Sprint"
   *                sprintID: 213
   *     responses:
   *       201:
   *         description: Task created successfully
   *       500:
   *         description: Failed to create task
   */
  /**
   * @swagger
   * /api/sprint-tasks/{id}:
   *   put:
   *     summary: Update an existing task
   *     tags: [Sprint Task Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The task ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Sprint updated successfully
   *       404:
   *         description: Sprint not found
   *       500:
   *         description: Failed to update task
   */
  /**
   * @swagger
   * /api/sprint-tasks/{id}:
   *   delete:
   *     summary: Soft delete a Sprint Task
   *     tags: [Sprint Task Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The sprint ID
   *     responses:
   *       200:
   *         description: Sprint Task deleted successfully
   *       404:
   *         description: Sprint Task not found
   *       500:
   *         description: Failed to delete Task
   */
  // Sprint TASK API END
}
