const BlockIcon = ({
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
      <path d='M 24 0 C 10.8 0 0 10.8 0 24 C 0 37.2 10.8 48 24 48 C 37.2 48 48 37.2 48 24 C 48 10.8 37.2 0 24 0 Z M 4.8 24 C 4.8 13.44 13.44 4.8 24 4.8 C 28.32 4.8 32.4 6.24 35.76 8.88 L 8.88 35.76 C 6.24 32.4 4.8 28.32 4.8 24 Z M 24 43.2 C 19.68 43.2 15.6 41.76 12.24 39.12 L 39.12 12.24 C 41.76 15.6 43.2 19.68 43.2 24 C 43.2 34.56 34.56 43.2 24 43.2 Z M 24 43.2' />
    </g>
  </svg>
)

export default BlockIcon