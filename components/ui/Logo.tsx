/** Logo Agentra — đường vẽ lấy nguyên từ docops-application/packages/ui/src/components/Logo.tsx (viewBox 415×354). */
export function LogoMark({ size = 26, title }: { size?: number; title?: string }) {
  const width = Math.round((size * 415) / 354)
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 415 354"
      fill="none"
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      {title ? <title>{title}</title> : null}
      <path d="M213 0 L270 103 L110 354 L0 354 Z" fill="#8cbf3c" />
      <path d="M288 133 L415 354 L302 354 L241 255 L209 253 Z" fill="#6a9c39" />
    </svg>
  )
}
