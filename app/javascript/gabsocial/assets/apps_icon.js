const AppsIcon = ({
  className = '',
  size = '16px',
  title = 'Apps',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 80 80'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <rect x='0' y='0' width='24' height='24' rx='4' />
      <rect x='0' y='28' width='24' height='24' rx='4' />
      <rect x='0' y='56' width='24' height='24' rx='4' />
      <rect x='28' y='0' width='24' height='24' rx='4' />
      <rect x='28' y='28' width='24' height='24' rx='4' />
      <rect x='28' y='56' width='24' height='24' rx='4' />
      <rect x='56' y='0' width='24' height='24' rx='4' />
      <rect x='56' y='28' width='24' height='24' rx='4' />
      <rect x='56' y='56' width='24' height='24' rx='4' />
    </g>
  </svg>
)

export default AppsIcon