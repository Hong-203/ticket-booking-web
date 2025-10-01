import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { generatePaymentCode } from 'src/utils/generate-payment-code';
import { PaymentMethod, PaymentStatus, TicketStatus } from 'src/constants';
import axios from 'axios';
import * as crypto from 'crypto';
import * as moment from 'moment';
const CryptoJS = require('crypto-js');
import {
  CreatePaymentMoMoDto,
  CreatePaymentZaloPayDto,
} from './dto/create-momo.dto';
import { console } from 'inspector';
const logger = new Logger('PaymentService');

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  async createMoMoPayment(dto: CreatePaymentMoMoDto) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: dto.ticketId },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const amount = Number(ticket.total_price);
    const orderId = `${Date.now()}-${dto.ticketId}`;
    const requestId = orderId;
    const paymentCode = generatePaymentCode();

    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const momoEndPoint = process.env.MOMO_ENDPOINT;
    const secretKey = process.env.MOMO_SECRET_KEY;

    if (!momoEndPoint) {
      throw new Error('MOMO_ENDPOINT is not defined');
    }
    if (!secretKey) {
      throw new Error('MOMO_SECRET_KEY is not defined');
    }

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Thanh toan ve xem phim&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo: 'Thanh toan ve xem phim',
      redirectUrl,
      ipnUrl,
      extraData: '',
      requestType: 'captureWallet',
      signature,
      lang: 'vi',
    };

    await this.paymentRepo.save({
      payment_code: paymentCode,
      method: PaymentMethod.MOMO,
      amount,
      status: PaymentStatus.PENDING,
      note: `Thanh toán Momo cho ticket ${ticket.id}`,
      user: ticket.user,
      email: ticket.user.email,
      ticket: ticket,
    });

    const response = await axios.post(momoEndPoint, payload);
    return response.data;
  }

  async createZaloPayPayment(ticketId: string) {
    logger.log(`Start creating ZaloPay payment for ticketId: ${ticketId}`);

    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const amount = Number(ticket.total_price);
    const transID = Math.floor(Math.random() * 1000000); // Trans ID theo ZaloPay

    const paymentCode = generatePaymentCode();

    const app_id = process.env.ZALO_APP_ID;
    const key1 = process.env.ZALO_KEY1;
    const endpoint =
      process.env.ZALO_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create';
    const callback_url = process.env.ZALO_CALLBACK_URL;
    const redirecturl = process.env.ZALO_REDIRECT_URL;

    if (!key1 || !app_id || !callback_url) {
      throw new Error('ZaloPay config is missing');
    }

    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const embed_data = {
      redirecturl: redirecturl,
      ticketId: ticket.id,
    };
    const items = [{}];

    const order: Record<string, any> = {
      app_id,
      app_trans_id,
      app_user: ticket.user.email || 'guest_user',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán vé xem phim - ${ticketId}`,
      // bank_code: 'zalopayapp',
      callback_url,
    };

    const data =
      app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = CryptoJS.HmacSHA256(data, key1).toString();

    await this.paymentRepo.save({
      payment_code: paymentCode,
      method: PaymentMethod.ZALOPAY,
      amount,
      status: PaymentStatus.PENDING,
      note: `Thanh toán ZaloPay cho ticket ${ticket.id}`,
      user: ticket.user,
      email: ticket.user.email,
      ticket: ticket,
    });

    try {
      logger.log(`Sending request to ZaloPay: ${endpoint}`);
      logger.debug(`Order payload: ${JSON.stringify(order, null, 2)}`);

      const response = await axios.post(endpoint, null, {
        params: order,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      logger.log(`ZaloPay response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error(
        'ZaloPay payment failed',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to create ZaloPay payment',
      );
    }
  }

  async handleMoMoIPN(ipnBody: any) {
    const { orderId, resultCode } = ipnBody;
    const ticketId = orderId.split('-').slice(1).join('-');

    const payment = await this.paymentRepo.findOne({
      where: { ticket: { id: ticketId }, method: PaymentMethod.MOMO },
      relations: ['ticket'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    payment.status =
      resultCode === 0 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await this.paymentRepo.save(payment);

    if (resultCode === 0) {
      payment.ticket.status = TicketStatus.BOOKED;
      await this.ticketRepo.save(payment.ticket);
    }

    return { message: 'IPN processed successfully' };
  }

  async handleZaloPayCallback(body: any) {
    try {
      logger.debug('Received body:', JSON.stringify(body));

      const embedData = JSON.parse(body.data.embed_data);
      const ticketId = embedData.ticketId;
      const dataStr = JSON.stringify(body.data);
      const reqMac = body.mac;
      const key2 = process.env.ZALO_KEY2;

      logger.debug('Parsed embedData:', embedData);
      logger.debug('Extracted ticketId:', ticketId);
      logger.debug('Generated dataStr:', dataStr);
      logger.debug('Received mac from ZaloPay:', reqMac);
      logger.debug('Loaded key2 from env:', !!key2);

      if (!key2) throw new Error('ZALO_KEY2 is missing');

      // Verify MAC
      const mac = CryptoJS.HmacSHA256(dataStr, key2).toString();
      logger.debug('Generated mac from dataStr:', mac);

      if (mac !== reqMac) {
        logger.warn('MAC mismatch - possible tampering!');
        return { return_code: -1, return_message: 'Invalid MAC' };
      }

      // Parse data again (redundant, can reuse body.data directly)
      let data: any;
      try {
        data = JSON.parse(dataStr);
        logger.debug('Parsed data:', data);
      } catch (e) {
        logger.error('Failed to parse dataStr:', e);
        return { return_code: -1, return_message: 'Invalid data format' };
      }

      // Find payment
      const payment = await this.paymentRepo.findOne({
        where: {
          ticket: { id: ticketId },
          method: PaymentMethod.ZALOPAY,
        },
        relations: ['ticket'],
      });

      if (!payment) {
        logger.warn('Payment not found for ticketId:', ticketId);
        return { return_code: -1, return_message: 'Payment not found' };
      }

      logger.debug('Payment found:', payment);

      // Update payment status
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentRepo.save(payment);
      logger.debug('Updated payment status to COMPLETED');

      // Update ticket status
      payment.ticket.status = TicketStatus.BOOKED;
      await this.ticketRepo.save(payment.ticket);
      logger.debug('Updated ticket status to BOOKED');

      return { return_code: 1, return_message: 'Success' };
    } catch (err) {
      logger.error('handleZaloPayCallback error:', err);
      return { return_code: -1, return_message: 'Internal Server Error' };
    }
  }

  /// mobile payment
  async createZaloPayPaymentMobile(ticketId: string) {
    logger.log(`Start creating ZaloPay payment for ticketId: ${ticketId}`);

    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const amount = Number(ticket.total_price);
    const transID = Math.floor(Math.random() * 1000000); // Trans ID theo ZaloPay
    const paymentCode = generatePaymentCode();

    const app_id = process.env.ZALO_APP_ID;
    const key1 = process.env.ZALO_KEY1;
    const endpoint =
      process.env.ZALO_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create';
    const callback_url = process.env.ZALO_CALLBACK_URL;
    const redirecturl = process.env.ZALO_REDIRECT_URL;

    if (!key1 || !app_id || !callback_url) {
      throw new Error('ZaloPay config is missing');
    }

    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const embed_data = {
      redirecturl, // client sẽ được redirect sau thanh toán
      ticketId: ticket.id,
      platform: 'mobile', // tùy chọn để phân biệt nếu cần
    };

    const items = [{}];

    const order: Record<string, any> = {
      app_id,
      app_trans_id,
      app_user: ticket.user.email || 'guest_user',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán vé xem phim - ${ticketId}`,
      callback_url,
    };

    const data = [
      app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join('|');

    order.mac = CryptoJS.HmacSHA256(data, key1).toString();

    // Lưu vào DB trước
    await this.paymentRepo.save({
      payment_code: paymentCode,
      method: PaymentMethod.ZALOPAY,
      amount,
      status: PaymentStatus.PENDING,
      note: `Thanh toán ZaloPay cho ticket ${ticket.id}`,
      user: ticket.user,
      email: ticket.user.email,
      ticket: ticket,
    });

    try {
      logger.log(`Sending request to ZaloPay: ${endpoint}`);
      const response = await axios.post(endpoint, null, {
        params: order,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = response.data;

      logger.log(`ZaloPay response: ${JSON.stringify(data)}`);

      // Trả về link thanh toán cho mobile
      return {
        order_url: data.order_url, // Mobile sẽ dùng cái này để mở WebView
        return_code: data.return_code,
        zp_trans_token: data.zp_trans_token,
      };
    } catch (error) {
      logger.error(
        'ZaloPay payment failed',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to create ZaloPay payment',
      );
    }
  }

  async createMoMoPaymentMobile(dto: CreatePaymentMoMoDto) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: dto.ticketId },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const amount = Number(ticket.total_price);
    const orderId = `${Date.now()}-${dto.ticketId}`;
    const requestId = orderId;
    const paymentCode = generatePaymentCode();

    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const momoEndPoint = process.env.MOMO_ENDPOINT;
    const secretKey = process.env.MOMO_SECRET_KEY;

    if (!momoEndPoint) {
      throw new Error('MOMO_ENDPOINT is not defined');
    }
    if (!secretKey) {
      throw new Error('MOMO_SECRET_KEY is not defined');
    }

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Thanh toan ve xem phim&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo: 'Thanh toan ve xem phim',
      redirectUrl,
      ipnUrl,
      extraData: '',
      requestType: 'captureWallet',
      signature,
      lang: 'vi',
    };

    await this.paymentRepo.save({
      payment_code: paymentCode,
      method: PaymentMethod.MOMO,
      amount,
      status: PaymentStatus.PENDING,
      note: `Thanh toán Momo cho ticket ${ticket.id}`,
      user: ticket.user,
      email: ticket.user.email,
      ticket: ticket,
    });

    const response = await axios.post(momoEndPoint, payload);
    const data = response.data;

    if (!data || !data.payUrl) {
      throw new InternalServerErrorException(
        'Không nhận được liên kết thanh toán từ MoMo',
      );
    }

    return {
      payUrl: data.payUrl, // ✅ mobile sẽ mở cái này bằng Linking.openURL()
      orderId: data.orderId,
      requestId: data.requestId,
      resultCode: data.resultCode,
      message: data.message,
    };
  }
}
