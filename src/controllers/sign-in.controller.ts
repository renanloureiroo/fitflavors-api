export class SignInController {
  static async handle() {
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: "1234567890" }),
    };
  }
}
