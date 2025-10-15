import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bwipjs from 'bwip-js';
import * as crypto from 'crypto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Barcode } from './entities/barcode.entity';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeStatusDto } from './dto/update-barcode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BarcodeService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Barcode)
    private readonly barcodeRepository: Repository<Barcode>,
  ) {}

  async generateBarcode(
    data: any,
  ): Promise<{ barcode_url: string; code: string }> {
    try {
      // 1️⃣ Tạo mã duy nhất ngắn gọn từ ticket_id + user_id (hash rút gọn)
      const rawString = `${data.ticket_id}-${data.user.id}`;
      const shortCode = crypto
        .createHash('sha256')
        .update(rawString)
        .digest('hex')
        .substring(0, 10); // ví dụ: a3f91d2b7e

      // 2️⃣ Tạo buffer ảnh barcode
      const pngBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // loại barcode
        text: shortCode, // chỉ encode chuỗi ngắn
        scale: 3,
        height: 10,
        includetext: true, // hiển thị text bên dưới barcode
      });

      // 3️⃣ Upload lên Cloudinary (folder: "ticket-barcodes")
      const folderName = 'ticket-barcodes';
      const barcodeUrl = await this.cloudinaryService.uploadImage(
        pngBuffer,
        folderName,
      );

      // 4️⃣ Trả về link public + mã barcode
      return {
        barcode_url: barcodeUrl,
        code: shortCode,
      };
    } catch (error) {
      console.error('❌ Lỗi khi tạo barcode:', error);
      throw new BadRequestException('Không thể tạo mã barcode');
    }
  }

  async create(createDto: CreateBarcodeDto): Promise<Barcode> {
    const barcode = this.barcodeRepository.create({
      barcodeUrl: createDto.barcodeUrl,
      code: createDto.code,
      ticket: createDto.ticketId
        ? ({ id: createDto.ticketId } as any)
        : undefined,
    });
    return await this.barcodeRepository.save(barcode);
  }

  // 🔵 FIND ALL
  async findAll(): Promise<Barcode[]> {
    return await this.barcodeRepository.find();
  }

  // 🟣 FIND ONE
  async findOne(id: string): Promise<Barcode> {
    const barcode = await this.barcodeRepository.findOne({ where: { id } });
    if (!barcode) throw new NotFoundException('Barcode not found');
    return barcode;
  }

  // 🟠 UPDATE STATUS
  async updateStatus(
    id: string,
    updateDto: UpdateBarcodeStatusDto,
  ): Promise<Barcode> {
    const barcode = await this.findOne(id);
    barcode.status = updateDto.status;
    return await this.barcodeRepository.save(barcode);
  }

  // 🔴 DELETE
  async remove(id: string): Promise<{ message: string }> {
    const barcode = await this.findOne(id);
    await this.barcodeRepository.remove(barcode);
    return { message: 'Barcode deleted successfully' };
  }
}
