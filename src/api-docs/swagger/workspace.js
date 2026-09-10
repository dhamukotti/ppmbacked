module.exports = () => {
  // PROJECT START
  /**
   * @swagger
   * components:
   *  schema:
   *    workspace:
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
   *        message: Workspace List Found.
   *        data:
   *          ID: 1
   *          Name: "Your Workpsace"
   *          CreateDate: 14/05/2024
   * */
  /**
   * @swagger
   * /api/workspace:
   *    get:
   *      summary: List workspaces .
   *      tags: [Workspace]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: The workspace list.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/workspace"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! workspace not found
   */
  /**
   * @swagger
   *  /api/workspace/{id}:
   *    get:
   *      summary: View workspace detail by id.
   *      tags: [Workspace]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The workspace id.
   *      responses:
   *        200:
   *          description: Workspace viewed successfully.
   *          content:
   *            application/json:
   *                    schema:
   *                          $ref: "#/components/schema/workspace"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! workspace not found
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
   * /api/workspace:
   *    post:
   *      summary: Add Workspace.
   *      tags: [Workspace]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                workspaceName:
   *                  type: string
   *                  description: The name of the workspace .
   *                organizationID:
   *                  type: int
   *                  description: The name of the project.
   *              example:
   *                workspaceName: "New Workspace"
   *                organizationID: 3
   *      responses:
   *        200:
   *          description: Workspace.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/workspace"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to create workspace!
   */
  /**
   * @swagger
   * /api/workspace/{id}:
   *    put:
   *      summary: Update workspace detail by id.
   *      tags: [Workspace]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The workspace id.
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                workspaceName:
   *                  type: string
   *                  description: The name of the project .
   *              example:
   *                  workspaceName: ppm-update
   *      responses:
   *        201:
   *          description: The user update.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/workspace"
   *        204:
   *          description: Request accepted but processing not completed.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: true
   *                  statusCode: 204
   *                  data: {}
   *                  message: Error! workspace not found
   *        406:
   *          description: Not Acceptable.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 406
   *                  data: {}
   *                  message: workspace not updated
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! workspace not found
   */
  /**
   * @swagger
   * /api/workspace/{id}:
   *    delete:
   *      summary: Delete workspace details by id.
   *      tags: [Workspace]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: The workspace id.
   *      responses:
   *        200:
   *          description: The workspace delete.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/workspace"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! workspace not deleted
   */
  // PROJECT END
}
