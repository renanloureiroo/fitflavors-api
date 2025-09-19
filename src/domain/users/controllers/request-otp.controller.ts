import { HttpHandler } from '@/core/http/http-handler';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { Valid } from '@/core/decorators/valid.decorator';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { RequestOTPUsecase } from '../usecases/request-otp.usecase';
import { DrizzleOTPVerificationRepository } from '@/infra/db/drizzle/repositories/drizzle-otp-verification.repository';
import { WhatsAppApiGateway } from '@/infra/providers/whatsapp-api.provider';
import {
  requestOTPSchema,
  RequestOTPRequest,
  RequestOTPResponse,
} from '../dtos/request-otp.dto';

export class RequestOTPController {
  static async handle(
    @Valid(requestOTPSchema)
    request: HttpRequest<RequestOTPRequest>
  ): Promise<HttpResponse> {
    try {
      const { countryCode, areaCode, phoneNumber } = request.body;
      const userId = request.context.userId!;

      const otpRepository = new DrizzleOTPVerificationRepository();
      const whatsappGateway = new WhatsAppApiGateway();

      const requestOTPUsecase = new RequestOTPUsecase(
        otpRepository,
        whatsappGateway
      );

      const result = await requestOTPUsecase.execute({
        countryCode,
        areaCode,
        phoneNumber,
        userId,
      });

      const response: RequestOTPResponse = {
        message: 'Código enviado para WhatsApp',
        expiresIn: result.expiresIn,
      };

      return HttpHandler.ok(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
