const PinIcon = ({
  className = '',
  size = '16px',
  title = 'Pin',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 32 32'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 25.98 19 C 25.98 19.91 25.28 20.62 24.4 20.62 L 19 20.62 L 16.79 31.4 C 16.71 31.77 16.39 32 16 32 C 15.64 32 15.32 31.77 15.24 31.4 L 13 20.62 L 7.63 20.62 C 6.75 20.62 6 19.91 6 19 C 6 16.64 7.44 14.49 9.62 13 L 9.62 8.34 L 8.15 8.34 C 7.28 8.34 6.57 7.63 6.57 6.75 L 6.57 1.58 C 6.57 0.71 7.28 0 8.15 0 L 23.88 0 C 24.76 0 25.46 0.71 25.46 1.58 L 25.46 6.75 C 25.46 7.63 24.76 8.34 23.88 8.34 L 22.41 8.34 L 22.41 13 C 24.59 14.49 25.98 16.64 25.98 19 Z M 25.98 19' />
    </g>
  </svg>
)

export default PinIcon