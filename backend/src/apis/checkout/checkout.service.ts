import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { OrderEntity } from '../orders/entities/order.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from 'src/common/constants/enum';
import { appConfig } from 'src/configs/app.config';
import Stripe from 'stripe';

const { stripe } = appConfig;

@Injectable()
export class CheckoutService {
    private readonly logger = new Logger(CheckoutService.name);
    private readonly stripeClient: Stripe;

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,

        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        this.stripeClient = new Stripe(stripe.secretKey, {
            apiVersion: '2025-02-24.acacia', // Sử dụng phiên bản ổn định (sửa từ '2025-02-24.acacia')
        });
    }

    async stripe(orderId: string): Promise<{ url: string }> {
        const order = await this.orderRepository.findOne({
            where: {
                id: orderId,
                status: ORDER_STATUS.PENDING,
            },
            relations: ['items'],
        });
        if (!order) throw new BadRequestException('ORDER_NOT_FOUND');

        // Kiểm tra order.items
        if (!order.items || order.items.length === 0) {
            throw new BadRequestException('No items found in order');
        }

        // Tạo mảng images với giá trị hợp lệ
        const imageUrls = order.items
            .map(item => item.productOrder?.featuredImage?.secure_url)
            .filter(url => url && url.trim() !== ''); // Loại bỏ null, undefined, và chuỗi rỗng

        // Tạo Checkout Session
        const session = await this.stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: `Đơn hàng ${orderId}`,
                            description: order.items
                                .map(item => item.productOrder?.name || 'Unnamed product')
                                .join(', ') || 'No products',
                            images: imageUrls.length > 0 ? imageUrls.slice(0, 1) : undefined, // Chỉ gửi nếu có URL hợp lệ, không gửi nếu rỗng
                        },
                        unit_amount: order.totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5001/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5001/cancel',
            metadata: { orderId },
        });

        // Lưu thông tin thanh toán
        const payment = await this.paymentRepository.findOne({
            where: {
                order: { id: orderId },
                status: Not(PAYMENT_STATUS.PAID),
            },
        });

        if (!payment) {
            await this.paymentRepository.insert({
                order,
                method: PAYMENT_METHOD.STRIPE,
                transactionId: session.id,
                status: PAYMENT_STATUS.PENDING,
                amount: order.totalAmount,
                paymentInformation: JSON.stringify(session),
            });
        } else {
            await this.paymentRepository.update(payment.id, {
                transactionId: session.id,
                status: PAYMENT_STATUS.PENDING,
                amount: order.totalAmount,
                paymentInformation: JSON.stringify(session),
            });
        }

        return { url: session.url };
    }
}