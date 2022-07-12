const CloseIcon = ({
  className = '',
  size = '16px',
  title = 'Close',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 14.12 12 L 23.56 2.56 C 24.14 1.98 24.14 1 23.56 0.44 C 22.97 -0.14 22 -0.14 21.44 0.44 L 12 9.88 L 2.56 0.44 C 1.97 -0.14 1 -0.14 0.44 0.44 C -0.14 1 -0.14 1.98 0.44 2.56 L 9.88 12 L 0.44 21.44 C -0.14 22 -0.14 22.97 0.44 23.56 C 0.73 23.86 1.12 24 1.5 24 C 1.88 24 2.27 23.86 2.56 23.56 L 12 14.12 L 21.44 23.56 C 21.73 23.86 22.12 24 22.5 24 C 22.88 24 23.27 23.86 23.56 23.56 C 24.14 22.97 24.14 22 23.56 21.44 Z M 14.12 12' />
    </g>
  </svg>
)

export default CloseIcon