const ListAddIcon = ({
  className = '',
  size = '24px',
  title = 'List Add',
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
      <path d='M19,7H8A1,1,0,0,1,8,5H19a1,1,0,0,1,0,2Z' />
      <path d='M19,11H8A1,1,0,0,1,8,9H19a1,1,0,0,1,0,2Z' />
      <path d='M13,15H8a1,1,0,0,1,0-2h5a1,1,0,0,1,0,2Z' />
      <circle cx='4' cy='6' r='1'/>
      <circle cx='4' cy='10' r='1'/>
      <circle cx='4' cy='14' r='1'/>
      <path d='M13,19H8a1,1,0,0,1,0-2h5a1,1,0,0,1,0,2Z' />
      <circle cx='4' cy='18' r='1'/>
      <path d='M21,15H20V14a1,1,0,0,0-2,0v1H17a1,1,0,0,0,0,2h1v1a1,1,0,0,0,2,0V17h1a1,1,0,0,0,0-2Z' />
    </g>
  </svg>
)

export default ListAddIcon