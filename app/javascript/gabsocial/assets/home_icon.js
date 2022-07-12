const HomeIcon = ({
  className = '',
  size = '26px',
  title = 'Home',
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
      <path d='M 47.24 21.7 L 25 0.42 C 24.46 -0.14 23.54 -0.14 22.96 0.42 L 0.74 21.72 C 0.27 22.19 0 22.84 0 23.5 C 0 24.88 1.12 26 2.5 26 L 6 26 L 6 45 C 6 46.66 7.34 48 9 48 L 17.5 48 C 18.33 48 19 47.33 19 46.5 L 19 33.5 C 19 33.23 19.22 33 19.5 33 L 28.5 33 C 28.77 33 29 33.23 29 33.5 L 29 46.5 C 29 47.33 29.67 48 30.5 48 L 39 48 C 40.66 48 42 46.66 42 45 L 42 26 L 45.5 26 C 46.88 26 48 24.88 48 23.5 C 48 22.84 47.73 22.19 47.24 21.7 Z M 47.24 21.7' />
    </g>
  </svg>
)

export default HomeIcon