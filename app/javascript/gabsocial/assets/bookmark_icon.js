const BookmarkIcon = ({
  className = '',
  size = '16px',
  title = 'Bookmark',
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
      <path d='M 39.06 0 L 8.94 0 C 8.16 0 7.53 0.63 7.53 1.41 L 7.53 46.59 C 7.53 47.16 7.88 47.68 8.4 47.89 C 8.57 47.96 8.76 48 8.94 48 C 9.3 48 9.66 47.86 9.93 47.59 L 24 33.52 L 38.07 47.59 C 38.47 47.99 39.07 48.11 39.6 47.89 C 40.13 47.68 40.47 47.16 40.47 46.59 L 40.47 1.41 C 40.47 0.63 39.84 0 39.06 0 Z M 39.06 0' />
    </g>
  </svg>
)

export default BookmarkIcon