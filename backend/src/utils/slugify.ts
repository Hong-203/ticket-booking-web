export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // chuyển thành dạng chuẩn
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // xóa ký tự đặc biệt
    .replace(/\s+/g, '-') // khoảng trắng -> -
    .replace(/-+/g, '-'); // nhiều dấu - thành 1
}
