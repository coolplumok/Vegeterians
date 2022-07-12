const CaretDownIcon = ({
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
    <path d='M 23.58 5.7 C 23.29 5.41 22.93 5.26 22.53 5.26 L 1.5 5.26 C 1.09 5.26 0.74 5.41 0.45 5.7 C 0.15 6 0 6.35 0 6.76 C 0 7.16 0.15 7.52 0.45 7.81 L 10.96 18.33 C 11.26 18.63 11.61 18.77 12.02 18.77 C 12.42 18.77 12.77 18.63 13.07 18.33 L 23.58 7.81 C 23.88 7.52 24.03 7.16 24.03 6.76 C 24.03 6.35 23.88 6 23.58 5.7 Z M 23.58 5.7' />
    </g>
  </svg>
)

export default CaretDownIcon