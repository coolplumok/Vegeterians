const GroupIcon = ({
  className = '',
  size = '26px',
  title = 'Group',
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
      <path d='M 41 25 L 37 25 C 37 26 37 27 37 28 L 37 42 C 37 43 37 43 37 44 L 43 44 C 46 44 48 42 48 40 L 48 32 C 48 28 44 25 41 25 Z M 41 25'/>
      <path d='M 10 28 C 10 27 10 26 10 25 L 6 25 C 3 25 0 28 0 32 L 0 40 C 0 42 1 44 4 44 L 10 44 C 10 43 10 43 10 42 Z M 10 28'/>
      <path d='M 28 22 L 19 22 C 15 22 12 25 12 28 L 12 42 C 12 43 13 44 14 44 L 33 44 C 34 44 35 43 35 42 L 35 28 C 35 25 32 22 28 22 Z M 28 22'/>
      <circle cx='8' cy='15' r='6'/>
      <circle cx='24' cy='11' r='9'/>
      <circle cx='40' cy='15' r='6'/>
    </g>
  </svg>
)

export default GroupIcon