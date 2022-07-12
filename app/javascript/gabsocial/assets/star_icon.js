const StarIcon = ({
  className = '',
  size = '24px',
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
    viewBox='0 0 24 24'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.42 3.96 1.481-8.279-6.064-5.828 8.332-1.151z"/>
    </g>
  </svg>
)

export default StarIcon