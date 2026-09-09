module.exports = () => {
  // ** AUTH START
  /**
   * @swagger
   * components:
   *  schema:
   *    login:
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
   *        message: logged in successfully.
   *        data:
   *          id: 1
   *          name: 'your_name'
   *          email: 'your_email@gmail.com'
   *    signup:
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
   *        message: Account Created Successfully.
   *        data:
   *          id: 1
   *          name: 'your_name'
   *          email: 'your_email@gmail.com'
   *    verifyToken:
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
   *        data:
   *            token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyQGdtYWlsLmNvbSIsImlhdCI6MTY2NDk1NDMzNCwiZXhwIjoxNjY1MDQwNzM0fQ.rHpnBA_MV89Cne24wCVLy70xLmPa0yED0z-iTk5n7so
   *        message: token verified successfully.
   *    refreshToken:
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
   *        data:
   *            refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyQGdtYWlsLmNvbSIsImlhdCI6MTY2NDk1NDMzNCwiZXhwIjoxNjY1MDQwNzM0fQ.rHpnBA_MV89Cne24wCVLy70xLmPa0yED0z-iTk5n7so
   *        message: token verified successfully.
   *    createToken:
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
   *        data:
   *            refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyQGdtYWlsLmNvbSIsImlhdCI6MTY2NDk1NDMzNCwiZXhwIjoxNjY1MDQwNzM0fQ.rHpnBA_MV89Cne24wCVLy70xLmPa0yED0z-iTk5n7so
   *        message: token verified successfully.
   */
  /**
  /**
   * @swagger
   * /api/login:
   *    post:
   *      summary: Login.
   *      tags: [Auth]
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  description: The email of the user.
   *                password:
   *                  type: string
   *                  description: The password of the user.
   *                latitude:
   *                  type: string
   *                  description: The ip_address of the user.
   *                longitude:
   *                  type: string
   *                  description: The device of the user.
   *              example:
   *                  email: ppm@gmail.com
   *                  password: ppm@223133
   *                  latitude: 22.22244
   *                  longitude: 74.5824
   *      responses:
   *        200:
   *          description: The login successfully.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/login"
   *        400:
   *          description: Bad Request.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 401
   *                  data: {}
   *                  message: Body can not be empty!
   *        404:
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 404
   *                  data: {}
   *                  message: No user available
   *        406:
   *          description: Not Acceptable.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 406
   *                  data: {}
   *                  message: Body can not be empty! || Invalid credentials
   */
  /**
   * @swagger
   * /api/signup:
   *    post:
   *      summary: Sign Up.
   *      tags: [Auth]
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                  description: your name.
   *                email:
   *                  type: string
   *                  description: The email of the user.
   *                password:
   *                  type: string
   *                  description: The password of the user.
   *                countryID:
   *                  type: int
   *                  description: selected country from list.
   *                latitude:
   *                  type: string
   *                  description: The ip_address of the user.
   *                longitude:
   *                  type: string
   *                  description: The device of the user.
   *                accountSource:
   *                  type: string
   *                  description: account source.
   *                address:
   *                  type: string
   *                  description: enter your address.
   *                organizationName:
   *                  type: string
   *                  description: name of organization.
   *                organizationSize:
   *                  type: string
   *                  description: no of people in organization.
   *              example:
   *                  name: ppm
   *                  email: ppm@gmail.com
   *                  password: ppm@223133
   *                  countryID: 103
   *                  latitude: 22.22244
   *                  longitude: 74.5824
   *                  accountSource: null
   *                  address: your_address_here
   *                  organizationName: null
   *                  organizationSize: null
   *      responses:
   *        200:
   *          description: Account Created Successfully.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/signup"
   *        400:
   *          description: Bad Request.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 400
   *                  data: {}
   *                  message: Invalid Values Provided
   *        422:
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Failed to signup
   */
  /**
   * @swagger
   *  /api/verify-token:
   *    get:
   *      summary: Verify JWT token.
   *      tags: [Auth]
   *      security:
   *        - bearerAuth: []
   *      responses:
   *        200:
   *          description: Check the generated token is valid or not
   *          content:
   *            application/json:
   *                    schema:
   *                          $ref: "#/components/schema/verifyToken"
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
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Token not match
   */
  /**
   * @swagger
   * /api/get-refresh-token:
   *    post:
   *      summary: Refresh Token to get Token.
   *      tags: [Auth]
   *      requestBody:
   *        requires: true
   *        content:
   *         application/json:
   *            schema:
   *              type: object
   *              properties:
   *                refresh_token:
   *                  type: string
   *                  description: The token of the user.
   *              example:
   *                  refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyQGdtYWlsLmNvbSIsImlhdCI6MTY2NDk1NDMzNCwiZXhwIjoxNjY1MDQwNzM0fQ.rHpnBA_MV89Cne24wCVLy70xLmPa0yED0z-iTk5n7so
   *      responses:
   *        200:
   *          description: The Refresh Token to Token Generator.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schema/createToken"
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
   *        422:
   *          description: Unprocessable Entity.
   *          content:
   *            application/json:
   *              schema:
   *                example:
   *                  status: false
   *                  statusCode: 422
   *                  data: {}
   *                  message: Token not match
   */
  // ** AUTH END
}
