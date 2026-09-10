module.exports = () => {
  // BUG QUEUE API START
  /**
   * @swagger
   * components:
   *  schema:
   *    bug-queue-list:
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
   *        message: Bugs found successfully.
   *
   * @swagger
   * /api/bug-queue:
   *    get:
   *      summary: List of Bugs.
   *      tags: [Bug Queue Management]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: List of bugs of user.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/bug-queue-list"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to get list of bugs!
   */
  /**
   * @swagger
   * /api/bug-queue/{id}:
   *   get:
   *     summary: Get Tasks by ID
   *     tags: [Bug Queue Management]
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
   * /api/bug-queue:
   *   post:
   *     summary: Create a new task in a sprint
   *     tags: [Bug Queue Management]
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
   * /api/bug-queue/{id}:
   *   put:
   *     summary: Update an existing task
   *     tags: [Bug Queue Management]
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
   * /api/bug-queue/{id}:
   *   delete:
   *     summary: Soft delete a Sprint Task
   *     tags: [Bug Queue Management]
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
  // BUG QUEUE API END
}
