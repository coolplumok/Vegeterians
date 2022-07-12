const WarningIcon = ({
  className = '',
  size = '16px',
  title = 'Warning',
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
      <path d='M 47 36 L 30 4.82 C 27.32 0.24 20.68 0.23 17.95 4.82 L 1 36 C -1.79 40.68 1.59 46.62 7 46.62 L 40.96 46.62 C 46.41 46.62 49.79 40.69 47 36 Z M 24 40.99 C 22.45 40.99 21.19 39.73 21.19 38.18 C 21.19 36.63 22.45 35.37 24 35.37 C 25.55 35.37 26.81 36.63 26.81 38.18 C 26.81 39.73 25.55 40.99 24 40.99 Z M 26.81 29.74 C 26.81 31.29 25.55 32.55 24 32.55 C 22.45 32.55 21.19 31.29 21.19 29.74 L 21.19 15.68 C 21.19 14.13 22.45 12.87 24 12.87 C 25.55 12.87 26.81 14.13 26.81 15.68 Z M 26.81 29.74' />
    </g>
  </svg>
)

export default WarningIcon