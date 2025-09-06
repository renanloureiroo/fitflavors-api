import { SignInController } from "../controllers/sign-in.controller";

export async function handler(event: any) {
  return await SignInController.handle();
}
