export class SignUpController {
  static async handle() {
    return {
      statusCode: 201,
      body: JSON.stringify({ accessToken: "1234567890" }),
    };
  }
}
