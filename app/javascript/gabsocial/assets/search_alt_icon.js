const SearchAltIcon = ({
  className = '',
  size = '16px',
  viewBox = '0 0 64 64',
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
    viewBox={viewBox}
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 61.73 50.43 L 51.19 39.9 C 53.11 36 54.38 31.6 54.38 27.13 C 54.38 12.13 42.25 0 27.25 0 C 12.25 0 0.12 12.13 0.12 27.13 C 0.12 42.13 12.25 54.27 27.25 54.27 C 31.72 54.27 36.19 52.99 40 51 L 50.55 61.61 C 53.75 64.80 58.54 64.80 61.73 61.61 C 64.6 58.41 64.6 53.63 61.73 50.43 Z M 27.25 47.88 C 15.76 47.88 6.5 38.63 6.5 27.13 C 6.5 15.64 15.76 6.38 27.25 6.38 C 38.74 6.38 48 15.64 48 27.13 C 48 38.63 38.74 47.88 27.25 47.88 Z M 27.25 47.88' />
    </g>
  </svg>
)

export default SearchAltIcon