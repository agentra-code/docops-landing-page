import { CopyButton } from '@/components/site/CopyButton'

/** SHA-512 thu gọn (14 ký tự đầu … 10 ký tự cuối) kèm nút sao chép toàn bộ. */
export function ChecksumField({ sha512, copyLabel, copiedLabel }: { sha512: string; copyLabel: string; copiedLabel: string }) {
  const short = sha512.length > 30 ? `${sha512.slice(0, 14)}…${sha512.slice(-10)}` : sha512
  return (
    <div className="flex items-center gap-2 rounded-control border border-dashed border-line px-2.5 py-2">
      <span className="text-[11px] font-bold tracking-[0.5px] text-muted">SHA-512</span>
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink2" title={sha512}>
        {short}
      </code>
      <CopyButton value={sha512} label={copyLabel} doneLabel={copiedLabel} iconOnly className="text-muted hover:text-ink" />
    </div>
  )
}
