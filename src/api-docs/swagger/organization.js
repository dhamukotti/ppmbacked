module.exports = () => {
  // Organization START
  /**
   * @swagger
   * components:
   *  schema:
   *    organization:
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
   *        message: Organization list found.
   *        data:
   *          OrganizationID: 1
   *          OrganizationName: PPM-Organization
   *          Country: 103
   *          CreateDate: 14/05/2024
   * @swagger
   * /api/organization:
   *    get:
   *      summary: List organizations .
   *      tags: [Organization]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: The Organization List.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/organization"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Error! organization not found
   *
   * @swagger
   * /api/organization:
   *    post:
   *      summary: Add organizations .
   *      tags: [Organization]
   *      security:
   *        - bearerAuth: []
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                OrganizationName:
   *                  type: string
   *                  description: name of organization.
   *                CountryID:
   *                  type: int
   *                  description: country id.
   *              example:
   *                  OrganizationName: ppm
   *                  CountryID: 103
   *      responses:
   *        200:
   *          description: Add Organization.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/organization"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to add organization
   *
   * @swagger
   * /api/organization/{id}:
   *    put:
   *      summary: Update organization
   *      tags: [Organization]
   *      security:
   *        - bearerAuth: []
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            required: true
   *            description: Organization ID.
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                OrganizationName:
   *                  type: string
   *                  description: name of organization.
   *                CountryID:
   *                  type: int
   *                  description: country id.
   *              example:
   *                  OrganizationName: ppm
   *                  CountryID: 103
   *      responses:
   *        200:
   *          description: Add Organization.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/organization"
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to add organization
   */
  // Organization END
}
