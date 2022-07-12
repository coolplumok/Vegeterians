const SearchIcon = ({
  className = '',
  size = '16px',
  title = 'Search',
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
      <path d='M 47.41 44.59 L 33.76 30.94 C 36.41 27.67 38 23.52 38 19 C 38 8.52 29.48 0 19 0 C 8.52 0 0 8.52 0 19 C 0 29.48 8.52 38 19 38 C 23.52 38 27.67 36.41 30.94 33.77 L 44.59 47.41 C 44.98 47.8 45.49 48 46 48 C 46.51 48 47 47.8 47.41 47.41 C 48.2 46.63 48.2 45.37 47.41 44.59 Z M 19 34 C 10.73 34 4 27.27 4 19 C 4 10.73 10.73 4 19 4 C 27.27 4 34 10.73 34 19 C 34 27.27 27.27 34 19 34 Z M 19 34' />
    </g>
  </svg>
)

export default SearchIcon