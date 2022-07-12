const BlockQuoteIcon = ({
  className = '',
  size = '16px',
  title = 'Block Quote',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 34 32'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 0 18.29 L 6.86 18.29 L 2.29 27.43 L 9.14 27.43 L 13.71 18.29 L 13.71 4.57 L 0 4.57 Z M 0 18.29' />
      <path d='M 18.29 4.57 L 18.29 18.29 L 25.14 18.29 L 20.57 27.43 L 27.43 27.43 L 32 18.29 L 32 4.57 Z M 18.29 4.57' />
    </g>
  </svg>
)

export default BlockQuoteIcon
