module.exports = () => {
  // Sprint API START
  /**
   * @swagger
   * components:
   *  schema:
   *    sprint-list:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *        statusCode:
   *          type: integer
   *        data:
   *          type: object
   *        message:
   *          type: string
   *      example:
   *        status: SUCCESS
   *        statusCode: 200
   *        message: Sprints found successfully.
   */
  /**
   * @swagger
   * /api/sprints:
   *    get:
   *      summary: List of Sprints.
   *      tags: [Sprint Management]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: List of sprints.
   *        422:
   *          description: Unprocessable Entity.
   */
  /**
   * @swagger
   * /api/sprints/{id}:
   *   get:
   *     summary: Get Sprint by ID
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sprint details retrieved
   *       404:
   *         description: Sprint not found
   */
  /**
   * @swagger
   * /api/sprints:
   *   post:
   *     summary: Create a new Sprint
   *     tags: [Sprint Management]
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
   *                workspaceID:
   *                  type: integer
   *                sprintGroupID:
   *                  type: integer
   *     responses:
   *       201:
   *         description: Sprint created successfully
   *       500:
   *         description: Failed to create sprint
   */
  /**
   * @swagger
   * /api/sprints/{id}:
   *   put:
   *     summary: Update an existing Sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
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
   *         description: Failed to update sprint
   */
  /**
   * @swagger
   * /api/sprints/{id}:
   *   delete:
   *     summary: Soft delete a Sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sprint deleted successfully
   *       404:
   *         description: Sprint not found
   *       500:
   *         description: Failed to delete sprint
   */
  // 🆕 Start Sprint
  /**
   * @swagger
   * /api/sprints/{id}/start:
   *   post:
   *     summary: Start a sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sprint started successfully
   *       404:
   *         description: Sprint not found
   */
  // 🆕 Pause Sprint
  /**
   * @swagger
   * /api/sprints/{id}/pause:
   *   post:
   *     summary: Pause a sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sprint paused successfully
   *       404:
   *         description: Sprint not found
   */
  // 🆕 Complete Sprint
  /**
   * @swagger
   * /api/sprints/{id}/complete:
   *   post:
   *     summary: Complete a sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sprint completed successfully
   *       404:
   *         description: Sprint not found
   */
  // 🆕 Update Sprint Timer
  /**
   * @swagger
   * /api/sprints/{id}/update-timer:
   *   post:
   *     summary: Add elapsed time (in seconds) to a sprint
   *     tags: [Sprint Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               seconds:
   *                 type: integer
   *                 description: Elapsed seconds to add
   *             example:
   *               seconds: 120
   *     responses:
   *       200:
   *         description: Sprint timer updated successfully
   *       404:
   *         description: Sprint not found
   */
  // Sprint API END
}
