const BoldIcon = ({
  className = '',
  size = '16px',
  title = 'Strikethrough',
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
      <path d='M 23.37 15.52 C 25.58 13.98 27.14 11.48 27.14 9.14 C 27.14 3.99 23.15 0 18 0 L 3.71 0 L 3.71 32 L 19.8 32 C 24.59 32 28.29 28.11 28.29 23.34 C 28.29 19.86 26.31 16.9 23.37 15.52 Z M 10.57 5.71 L 17.43 5.71 C 19.32 5.71 20.86 7.25 20.86 9.14 C 20.86 11.04 19.32 12.57 17.43 12.57 L 10.57 12.57 Z M 18.57 26.29 L 10.57 26.29 L 10.57 19.43 L 18.57 19.43 C 20.47 19.43 22 20.96 22 22.86 C 22 24.75 20.47 26.29 18.57 26.29 Z M 18.57 26.29' />
    </g>
  </svg>
)

export default BoldIcon