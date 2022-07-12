const MediaIcon = ({
  className = '',
  size = '16px',
  title = 'Media',
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
      <path d='M 58 0 L 6 0 C 2.6875 0 0 2.6875 0 6 L 0 58 C 0 61.3125 2.6875 64 6 64 L 58 64 C 61.3125 64 64 61.3125 64 58 L 64 6 C 64 2.6875 61.3125 0 58 0 Z M 60 39.179688 L 51.421875 30.601562 C 50.640625 29.824219 49.378906 29.824219 48.601562 30.601562 L 38 41.179688 L 25.421875 28.601562 C 24.640625 27.824219 23.378906 27.824219 22.601562 28.601562 L 4 47.179688 L 4 6 C 4 4.894531 4.894531 4 6 4 L 58 4 C 59.105469 4 60 4.894531 60 6 Z M 60 39.179688' />
      <circle cx='42' cy='16' r='6' />
    </g>
  </svg>
)

export default MediaIcon