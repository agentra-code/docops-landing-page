import snapshot from '@/content/releases.json'

/** Bản chụp feed commit trong repo — dự phòng khi VPS không trả lời. Cập nhật bằng `pnpm sync-releases`. */
export const releaseSnapshot = snapshot as { windows: unknown; mac: unknown }
