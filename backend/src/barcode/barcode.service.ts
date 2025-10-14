import { Injectable, BadRequestException } from '@nestjs/common';
import * as bwipjs from 'bwip-js';
import * as crypto from 'crypto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BarcodeService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

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
}
