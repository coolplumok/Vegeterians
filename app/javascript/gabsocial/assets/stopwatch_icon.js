const StopwatchIcon = ({
  className = '',
  size = '16px',
  title = '',
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
      <path d='M 18.01 0 L 18.01 4 L 22.02 4 L 22.02 6.01 C 23.42 5.8 24.62 5.8 26.02 6.01 L 26.02 4 L 30.02 4 L 30.02 0 Z M 18.01 0' />
      <path d='M 37.63 13.21 L 39.04 11.81 L 40.64 13.41 L 43.44 10.61 L 37.43 4.61 L 34.63 7.41 L 36.23 9.01 L 34.43 10.81 C 24.82 5 12.41 8.01 6.8 17.62 C 1.2 27.23 4.2 39.24 13.61 45.05 C 23.02 50.85 35.43 47.85 41.04 38.24 C 46.04 30.03 44.64 19.62 37.63 13.21 Z M 24.02 41.84 C 16.21 41.84 10 35.64 10 27.83 C 10 20.02 16.21 13.81 24.02 13.81 L 24.02 27.83 L 38.03 27.83 C 38.03 35.64 31.83 41.84 24.02 41.84 Z M 24.02 41.84' />
    </g>
  </svg>
)

export default StopwatchIcon