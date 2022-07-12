const GlobeIcon = ({
  className = '',
  size = '12px',
  title = 'Globe',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 28 28'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <circle fill='none' stroke='#4B4F55' strokeWidth='1px' cx='14' cy='14' r='13.5' />
      <path fill='#4B4F55' d='M 16 5 L 18 4 L 20 5 L 22 5 L 23 4 C 24 5 25 6 25 7 L 25 7 L 22 8 L 20 7 L 19 6 L 16 6 L 14 7 L 15 11 L 18 12 L 20 12 L 21 13 L 21 14 L 22 16 L 23 18 L 23 20 L 26.4 21 C 20 27 12 29 6 25 C 1 21 0 14 1 8 L 2 11 L 3 12 L 5 13 L 4 14 L 4 15 L 5 17 L 7 17 L 7 22 L 8 24 L 9 25 L 9 22 L 11 21 L 11 20 L 13 18 L 14 15 L 12 15 L 10 13 L 7 13 L 6 11 L 5 13 L 5 11 L 4 10 L 4 8 L 7 8 L 9 7 L 11 4 L 12 4 L 13 2 L 10 2 L 10 1 C 12 0 16 0 18 1 L 18 2 L 16 2 L 15 4 Z M 16 5' />
    </g>
  </svg>
)

export default GlobeIcon
