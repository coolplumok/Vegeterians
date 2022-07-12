const PipIcon = ({
  className = '',
  size = '16px',
  title = 'Picture in Picture',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 40 40'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <rect x='2' y='2' width='36' height='36' rx='1' fill='none' stroke='#fff' strokeWidth='4' />
      <rect x='18' y='18' width='12' height='12' fill='none' stroke='#fff' strokeWidth='3' />
    </g>
  </svg>
)

export default PipIcon