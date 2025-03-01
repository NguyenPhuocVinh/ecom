import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
    constructor(
        private readonly checkoutService: CheckoutService
    ) { }

    @Post('stripe/:orderId')
    async stripe(
        @Param('orderId') orderId: string,
        @Req() req: any
    ) {
        return await this.checkoutService.stripe(orderId);
    }
}
