const WebsiteIcon = ({
  className = '',
  size = '16px',
  title = 'Website',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 48 48'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 42.51 45.09 L 5.45 45.09 C 2.44 45.09 0 42.65 0 39.65 L 0 8.22 C 0 5.22 2.44 2.78 5.45 2.78 L 42.51 2.78 C 45.51 2.78 47.95 5.22 47.95 8.22 L 47.95 39.65 C 47.95 42.65 45.51 45.09 42.51 45.09 Z M 5.45 4.4 C 3.34 4.4 1.62 6.12 1.62 8.22 L 1.62 39.65 C 1.62 41.76 3.34 43.47 5.45 43.47 L 42.51 43.47 C 44.62 43.47 46.33 41.76 46.33 39.65 L 46.33 8.22 C 46.33 6.12 44.62 4.4 42.51 4.4 Z M 5.45 4.4' />
      <path d='M 47.14 13.64 L 0.81 13.64 C 0.36 13.64 0 13.27 0 12.82 C 0 12.38 0.36 12.02 0.81 12.02 L 47.14 12.02 C 47.59 12.02 47.95 12.38 47.95 12.82 C 47.95 13.27 47.59 13.64 47.14 13.64 Z M 47.14 13.64' />
      <rect x='7' y='20' width='33' height='2' />
      <rect x='7' y='27' width='33' height='2' />
      <rect x='7' y='35' width='33' height='2' />
      <circle cx='6' cy='8.5' r='1.5' />
      <circle cx='12' cy='8.5' r='1.5' />
      <circle cx='18' cy='8.5' r='1.5' />
    </g>
  </svg>
)

export default WebsiteIcon