import { Layers2 } from 'lucide-react';
import Link from 'next/link';
export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="RollOS home">
      <span className="brand-mark">
        <Layers2 size={20} />
      </span>
      <div>
        roll<span>os</span>
        <span style={{ fontSize: 10, verticalAlign: 'top', marginLeft: 3, color: '#99ac91' }}>
          ®
        </span>
      </div>
    </Link>
  );
}
export function Dumpster({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="dumpster-svg"
      viewBox="0 0 130 75"
      fill="none"
      role="img"
      aria-label={`${size} yard dumpster`}
    >
      <path d="M9 20L101 11L123 21L115 62L31 72L14 59L9 20Z" fill="currentColor" opacity=".18" />
      <path
        d="M9 20L101 11L123 21L115 62L31 72L14 59L9 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 20L31 30L123 21M31 30V72M101 11L102 24M14 59L30 66M47 32L46 64M67 29L66 62M88 27L86 59M108 25L104 57"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M5 16L101 7L128 19L126 24L101 15L10 25L5 16Z" fill="currentColor" opacity=".35" />
      <path
        d="M5 16L101 7L128 19L126 24L101 15L10 25L5 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="43" y="71" width="11" height="4" rx="2" fill="currentColor" />
      <rect x="100" y="64" width="10" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}
