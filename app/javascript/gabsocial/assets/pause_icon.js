const PauseIcon = ({
  className = '',
  size = '16px',
  title = 'Pause',
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
      <rect x='6' y='0' width='18' height='64' rx='4' />
      <rect x='40' y='0' width='18' height='64' rx='4' />
    </g>
  </svg>
)

export default PauseIcon