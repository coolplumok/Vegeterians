const MissingIcon = ({
  className = '',
  size = '32px',
  title = 'Missing',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 84 84'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 30.22 0 L 12.6 17.62 L 12.6 84 L 71.4 84 L 71.4 0 Z M 29.4 4.78 L 29.4 16.8 L 17.38 16.8 Z M 68.6 81.2 L 15.4 81.2 L 15.4 19.6 L 32.2 19.6 L 32.2 2.8 L 68.6 2.8 Z M 68.6 81.2' />
      <path d='M 34.76 33.26 L 30.8 37.22 L 26.84 33.26 L 24.86 35.24 L 28.82 39.2 L 24.86 43.16 L 26.84 45.14 L 30.8 41.18 L 34.76 45.14 L 36.74 43.16 L 32.78 39.2 L 36.74 35.24 Z M 34.76 33.26' />
      <path d='M 47.84 45.14 L 51.8 41.18 L 55.76 45.14 L 57.74 43.16 L 53.78 39.2 L 57.74 35.24 L 55.76 33.26 L 51.8 37.22 L 47.84 33.26 L 45.86 35.24 L 49.82 39.2 L 45.86 43.16 Z M 47.84 45.14' />
      <path d='M 29.81 57.81 L 31.79 59.79 L 33 58.49 C 38 53.58 45.98 53.58 50.91 58.49 L 52.21 59.79 L 54.19 57.81 L 52.89 56.51 C 46.87 50.5 37.13 50.5 31.11 56.51 Z M 29.81 57.81' />
    </g>
  </svg>
)

export default MissingIcon