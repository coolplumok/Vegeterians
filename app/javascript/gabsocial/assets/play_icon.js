const PlayIcon = ({
  className = '',
  size = '16px',
  title = 'Play',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 64 64'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 52.49 26 L 16.94 1.72 C 15.3 0.59 13.64 0 12.27 0 C 9.61 0 7.97 2.13 7.97 5.7 L 7.97 58.3 C 7.97 61.87 9.61 64 12.26 64 C 13.64 64 15.27 63.4 16.91 62.28 L 52.48 37.94 C 54.77 36.37 56 34.26 56 32 C 56 29.73 54.78 27.63 52.49 26 Z M 52.49 26' />
    </g>
  </svg>
)

export default PlayIcon