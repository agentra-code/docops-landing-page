import { site } from '@/lib/site'

/** Tên mã theo số lớn (major) của phiên bản: 1.x là Uranus. Thêm dòng mới khi lên 2.x. */
export const CODENAMES: Record<number, string> = {
  1: 'Uranus',
}

/** "1.0.3" → "Uranus"; không có tên mã thì undefined. */
export function codename(version: string): string | undefined {
  const major = Number.parseInt(version, 10)
  return Number.isFinite(major) ? CODENAMES[major] : undefined
}

/** "DocOps Uranus" (hoặc "DocOps" khi phiên bản chưa có tên mã). */
export function productName(version: string): string {
  const name = codename(version)
  return name ? `${site.shortName} ${name}` : site.shortName
}

/** Nhãn ngắn cho phiên bản, không kèm tên sản phẩm: "Uranus 1.0.3" hoặc "v1.0.3". */
export function versionLabel(version: string): string {
  const name = codename(version)
  return name ? `${name} ${version}` : `v${version}`
}

/** Nhãn đầy đủ: "DocOps Uranus 1.0.3" hoặc "DocOps 1.0.3". */
export function releaseLabel(version: string): string {
  return `${productName(version)} ${version}`
}
