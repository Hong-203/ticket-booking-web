import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { TicketSeatBooking } from './entities/TicketSeatBooking.entity';
import { TicketConcession } from './entities/TicketConcession.entity';
import { ConcessionItem } from 'src/concession-item/entities/concession-item.entity';
import { console } from 'inspector';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mail/mail.service';
import { BarcodeService } from 'src/barcode/barcode.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(SeatBooking)
    private readonly seatBookingRepository: Repository<SeatBooking>,

    @InjectRepository(TicketSeatBooking)
    private readonly ticketSeatBookingRepository: Repository<TicketSeatBooking>,

    @InjectRepository(TicketConcession)
    private readonly ticketConcessionRepository: Repository<TicketConcession>,

    @InjectRepository(ConcessionItem)
    private readonly concessionItemRepository: Repository<ConcessionItem>,

    @InjectRepository(Showtime)
    private readonly shownTimeRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailerService: MailerService,

    private readonly barcodeService: BarcodeService,
  ) {}

  async createTicket(
    data: {
      seat_total_price: number;
      concession_total_price: number;
      seat_booking_ids: string[];
      concessions: { item_id: string; quantity: number }[];
    },
    user_id: string,
  ): Promise<Ticket> {
    const {
      seat_total_price,
      concession_total_price,
      seat_booking_ids,
      concessions,
    } = data;

    const total_price = seat_total_price + concession_total_price;

    // 1. Tạo ticket
    const ticket = this.ticketRepository.create({
      user: { id: user_id } as any,
      seat_total_price,
      concession_total_price,
      total_price,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // 2. Tạo TicketSeatBooking
    console.log('seat_booking_ids', seat_booking_ids);

    const seatBookings = await this.seatBookingRepository.find({
      where: {
        id: In(seat_booking_ids),
      },
    });
    console.log('seatBookings', seatBookings);
    if (seatBookings.length !== seat_booking_ids.length) {
      throw new BadRequestException(
        'Một hoặc nhiều seat_booking_id không tồn tại',
      );
    }

    const ticketSeatBookings = seatBookings.map((sb) =>
      this.ticketSeatBookingRepository.create({
        ticket: savedTicket,
        seatBooking: sb,
      }),
    );

    await this.ticketSeatBookingRepository.save(ticketSeatBookings);

    // 3. Tạo TicketConcession
    const itemIds = concessions.map((c) => c.item_id);
    const items = await this.concessionItemRepository.find({
      where: {
        id: In(itemIds),
      },
    });

    const ticketConcessions = concessions.map((c) => {
      const item = items.find((i) => i.id === c.item_id);
      if (!item)
        throw new BadRequestException(
          `Không tìm thấy item với id: ${c.item_id}`,
        );

      return this.ticketConcessionRepository.create({
        ticket: savedTicket,
        item,
        quantity: c.quantity,
        total_price: Number(item.price) * c.quantity,
      });
    });

    await this.ticketConcessionRepository.save(ticketConcessions);

    const ticketWithRelations = await this.ticketRepository.findOne({
      where: { id: savedTicket.id },
      relations: [
        'seatBookings',
        'seatBookings.seatBooking',
        'concessions',
        'concessions.item',
      ],
    });

    if (!ticketWithRelations) {
      throw new BadRequestException('Không tìm thấy ticket sau khi tạo');
    }

    return ticketWithRelations;
  }

  async getTicketDetail(ticketId: string): Promise<any> {
    console.log('ticketId', ticketId);
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'user',
        'seatBookings',
        'seatBookings.seatBooking',
        'seatBookings.seatBooking.seat',
        'concessions',
        'concessions.item',
      ],
    });

    if (!ticket) {
      throw new BadRequestException('Không tìm thấy vé');
    }

    const firstSeatBooking = ticket.seatBookings[0]?.seatBooking;

    const [movie, hall, showtime] = await Promise.all([
      this.movieRepository.findOne({
        where: { id: firstSeatBooking?.movie_id },
      }),
      this.hallRepository.findOne({ where: { id: firstSeatBooking?.hall_id } }),
      this.shownTimeRepository.findOne({
        where: { id: firstSeatBooking?.showtime_id },
      }),
    ]);

    return {
      id: ticket.id,
      user_id: ticket.user?.id,
      seat_total_price: ticket.seat_total_price,
      concession_total_price: ticket.concession_total_price,
      total_price: ticket.total_price,
      movie_id: firstSeatBooking?.movie_id,
      hall_id: firstSeatBooking?.hall_id,
      showtime_id: firstSeatBooking?.showtime_id,
      seats: ticket.seatBookings.map((tsb) => ({
        id: tsb.seatBooking.id,
        seat: tsb.seatBooking.seat,
        status: tsb.seatBooking.status,
      })),
      movie,
      hall,
      showtime,
      concessions: ticket.concessions.map((c) => ({
        item: c.item,
        quantity: c.quantity,
        total_price: c.total_price,
      })),
    };
  }

  async getTicketsByUser(userId: string): Promise<any[]> {
    const tickets = await this.ticketRepository.find({
      where: { user: { id: userId } },
      select: ['id'],
      order: { created_at: 'DESC' },
    });

    const ticketDetails = await Promise.all(
      tickets.map((ticket) => this.getTicketDetail(ticket.id)),
    );

    return ticketDetails;
  }

  async ticketInfo(ticketId: string): Promise<any> {
    // 1️⃣ Lấy thông tin vé và các quan hệ liên quan
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'user',
        'seatBookings',
        'seatBookings.seatBooking',
        'seatBookings.seatBooking.seat',
        'concessions',
        'concessions.item',
      ],
    });

    if (!ticket) {
      throw new BadRequestException('Không tìm thấy vé');
    }

    // 2️⃣ Lấy thông tin ghế đầu tiên (để truy ra phim, suất chiếu, phòng chiếu)
    const firstSeatBooking = ticket.seatBookings[0]?.seatBooking;
    if (!firstSeatBooking) {
      throw new BadRequestException('Vé không có thông tin ghế');
    }

    const [movie, hall, showtime] = await Promise.all([
      this.movieRepository.findOne({
        where: { id: firstSeatBooking.movie_id },
      }),
      this.hallRepository.findOne({ where: { id: firstSeatBooking.hall_id } }),
      this.shownTimeRepository.findOne({
        where: { id: firstSeatBooking.showtime_id },
      }),
    ]);

    if (!movie || !hall || !showtime) {
      throw new BadRequestException(
        'Dữ liệu phim, suất chiếu hoặc phòng chiếu không hợp lệ',
      );
    }

    // 3️⃣ Lấy thông tin người dùng
    const user = await this.userRepository.findOne({
      where: { id: ticket.user.id },
    });

    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    const barcodePayload = {
      ticket_id: ticket.id,
      movie: movie.name,
      showtime: showtime.movie_start_time,
      seats: ticket.seatBookings
        .map((s) => s.seatBooking?.seat?.name)
        .filter(Boolean),
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const barcodeUrl =
      await this.barcodeService.generateBarcode(barcodePayload);

    // 4️⃣ Chuẩn bị dữ liệu vé
    const seatNames = ticket.seatBookings
      .map((tsb) => tsb.seatBooking?.seat?.name)
      .filter(Boolean)
      .join(', ');

    const foodList =
      ticket.concessions.length > 0
        ? ticket.concessions
            .map((c) => `${c.item.name} x${c.quantity}`)
            .join(', ')
        : 'Không';

    const emailContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận đặt vé</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎬 Cinezone</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Xác nhận đặt vé thành công</p>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 22px;">Xin chào ${user.full_name},</h2>
                  <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.6;">
                    Cảm ơn bạn đã sử dụng dịch vụ của <strong>Cinezone</strong>! 
                    Hệ thống xác nhận bạn đã đặt vé xem phim thành công.
                  </p>
                </td>
              </tr>

              <!-- Barcode Section -->
              <tr>
                <td style="padding: 0 30px;">
                  <table role="presentation" style="width: 100%; background-color: #f8f9ff; border-radius: 8px; padding: 20px; border: 2px dashed #667eea;">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 15px 0; color: #667eea; font-size: 18px; font-weight: bold;">🎟️ MÃ BARCODE</p>
                        <p style="margin: 0 0 10px 0; color: #333333; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${barcodeUrl.code}</p>
                        <img src="${barcodeUrl.barcode_url}" alt="Barcode" style="width: 250px; height: auto; margin: 10px 0;" />
                        <p style="margin: 10px 0 0 0; color: #666666; font-size: 13px; font-style: italic;">
                          Đem mã này đến quầy giao dịch hoặc nhân viên soát vé
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Ticket Details -->
              <tr>
                <td style="padding: 30px;">
                  <h3 style="margin: 0 0 20px 0; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                    📋 Chi tiết đặt vé
                  </h3>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">Mã đặt vé:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">#${ticket.id}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">🎬 Phim:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px; font-weight: bold;">${movie.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">🕐 Thời gian chiếu:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">${showtime.movie_start_time} - ${new Date(showtime.showtime_date).toLocaleDateString('vi-VN')}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">🎭 Phòng chiếu:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">${hall.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">💺 Số ghế:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #667eea; font-size: 14px; font-weight: bold;">${seatNames}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">🎫 Số vé:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">${ticket.seatBookings.length} vé</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">🍿 Thức ăn kèm:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">${foodList || 'Không có'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
                        <strong style="color: #555555; font-size: 14px;">📍 Địa chỉ:</strong>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                        <span style="color: #333333; font-size: 14px;">${hall.theatre || 'Đang cập nhật'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 12px 0;">
                        <strong style="color: #333333; font-size: 16px;">💰 Tổng tiền:</strong>
                      </td>
                      <td style="padding: 15px 0 12px 0; text-align: right;">
                        <span style="color: #e74c3c; font-size: 20px; font-weight: bold;">${ticket.total_price.toLocaleString('vi-VN')} đ</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Customer Info -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                    👤 Thông tin người nhận vé
                  </h3>
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #666666; font-size: 14px;">📝 Họ và tên:</span>
                        <strong style="color: #333333; font-size: 14px; margin-left: 10px;">${user.full_name}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #666666; font-size: 14px;">📞 Số điện thoại:</span>
                        <strong style="color: #333333; font-size: 14px; margin-left: 10px;">${user.phone_number}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #666666; font-size: 14px;">✉️ Email:</span>
                        <strong style="color: #333333; font-size: 14px; margin-left: 10px;">${user.email}</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Support Info -->
              <tr>
                <td style="background-color: #f8f9ff; padding: 25px 30px;">
                  <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px;">
                    📞 Liên hệ hỗ trợ
                  </h3>
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Trong trường hợp cần hỗ trợ, vui lòng dùng chính số điện thoại đăng ký tài khoản để liên hệ tổng đài Cinezone.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #333333; font-size: 16px;">
                    <strong>Hotline: <a href="tel:1900545441" style="color: #667eea; text-decoration: none;">1900 54 54 41</a></strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #333333; padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #ffffff; font-size: 13px;">
                    © 2024 Cinezone. Hệ thống đặt vé xem phim trực tuyến.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                    Email này được gửi tự động, vui lòng không trả lời email này.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await this.mailerService.sendMail(
      user.email,
      `Xác nhận đặt vé Cinezone thành công - Mã giao dịch ${ticket.id}`,
      emailContent,
    );
    return {
      message:
        'Xác nhận đặt vé Cinezone thành công đã được gửi đến email của bạn',
    };
    // 6️⃣ Trả về dữ liệu tổng hợp
    // return {
    //   id: ticket.id,
    //   seat_total_price: ticket.seat_total_price,
    //   concession_total_price: ticket.concession_total_price,
    //   total_price: ticket.total_price,

    //   movie,
    //   hall,
    //   showtime,
    //   barcode_url: barcodeUrl,
    //   seats: ticket.seatBookings.map((tsb) => ({
    //     id: tsb.seatBooking.id,
    //     seat: tsb.seatBooking.seat,
    //     status: tsb.seatBooking.status,
    //   })),

    //   concessions: ticket.concessions.map((c) => ({
    //     item: c.item,
    //     quantity: c.quantity,
    //     total_price: c.total_price,
    //   })),

    //   user: {
    //     id: user.id,
    //     username: user.full_name,
    //     email: user.email,
    //     phone_number: user.phone_number,
    //     avatar_url: user.avatar_url,
    //   },

    //   created_at: ticket.created_at,
    //   updated_at: ticket.updated_at,

    //   emailContent, // 👉 Nội dung email bạn có thể gửi trực tiếp qua mail service
    // };
  }
}
