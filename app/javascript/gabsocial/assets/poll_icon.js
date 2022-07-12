const PollIcon = ({
  className = '',
  size = '16px',
  title = 'Poll',
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
      <path d='M 42.67 0 L 5.33 0 C 2.39 0 0 2.39 0 5.33 L 0 42.67 C 0 45.61 2.39 48 5.33 48 L 42.67 48 C 45.61 48 48 45.61 48 42.67 L 48 5.33 C 48 2.39 45.61 0 42.67 0 Z M 16 37.33 L 10.67 37.33 L 10.67 18.67 L 16 18.67 Z M 26.67 37.33 L 21.33 37.33 L 21.33 10.67 L 26.67 10.67 Z M 37.33 37.33 L 32 37.33 L 32 26.67 L 37.33 26.67 Z M 37.33 37.33' />
    </g>
  </svg>
)

export default PollIcon