const TrendsIcon = ({
  className = '',
  size = '32px',
  title = 'Vegeterians.News',
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
      <rect x='0' y='0' width='24' height='56' rx='4' />
      <rect x='0' y='60' width='24' height='20' rx='4' />
      <rect x='28' y='44' width='24' height='36' rx='4' />
      <rect x='28' y='16' width='24' height='24' rx='4' />
      <rect x='56' y='64' width='24' height='16' rx='4' />
      <rect x='56' y='30' width='24' height='30' rx='4' />
    </g>
  </svg>
)

export default TrendsIcon
