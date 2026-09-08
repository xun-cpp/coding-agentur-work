const paths = {
  web: 'M3 8h18M6 5h.01M9 5h.01M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM7 12h5M7 16h10',
  app: 'M9 3h6M10 18h4M7 1h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z',
  pos: 'M4 3h16v12H4ZM8 15v4m8-4v4M5 20h14M8 7h3m-3 4h7',
  portal: 'M3 4h18v16H3ZM8 4v16M12 9h5m-5 5h5',
  desktop: 'M2 3h20v14H2Zm10 14v4m-5 0h10',
  tablet: 'M5 2h14v20H5Zm6 17h2',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12 4 4 10-10',
  pause: 'M8 5v14M16 5v14',
  play: 'm8 4 12 8-12 8Z',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  shield: 'm12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5Zm-4 9 3 3 5-6',
  mail: 'M3 5h18v14H3Zm0 0 9 8 9-8',
} as const;

export type WidgetIconName = keyof typeof paths;
export default function WidgetIcon({ name, className }: { name: WidgetIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
