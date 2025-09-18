import { HttpHandler } from '@/core/http/http-handler';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { Valid } from '@/core/decorators/valid.decorator';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { VerifyOTPUsecase } from '../usecases/verify-otp.usecase';
import { DrizzleOTPVerificationRepository } from '@/infra/db/drizzle/repositories/drizzle-otp-verification.repository';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { verifyOTPSchema, VerifyOTPRequest } from '../dtos/verify-otp.dto';

export class VerifyOTPController {
  static async handle(
    @Valid(verifyOTPSchema)
    request: HttpRequest<VerifyOTPRequest>
  ): Promise<HttpResponse> {
    try {
      const { countryCode, areaCode, phoneNumber, code } = request.body;
      const userId = request.context.userId!;

      // Repositórios
      const otpRepository = new DrizzleOTPVerificationRepository();
      const userRepository = new DrizzleUserRepository();

      // Use case
      const verifyOTPUsecase = new VerifyOTPUsecase(
        otpRepository,
        userRepository
      );

      const result = await verifyOTPUsecase.execute({
        countryCode,
        areaCode,
        phoneNumber,
        code,
        userId,
      });

      const response = {
        verified: result.verified,
        phoneNumber: result.phoneNumber,
        message: result.message,
      };

      return HttpHandler.ok(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
