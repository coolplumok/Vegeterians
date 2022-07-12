const PencilIcon = ({
  className = '',
  size = '16px',
  title = 'Pencil',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 64 64'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 22.609375 56.027344 L 8.085938 41.503906 L 43.214844 6.371094 L 57.742188 20.898438 Z M 6.726562 44.0625 L 20.050781 57.386719 L 0.0742188 64.039062 Z M 62.207031 16.449219 L 59.6875 18.96875 L 45.144531 4.421875 L 47.664062 1.90625 C 50.203125 -0.636719 54.316406 -0.636719 56.855469 1.90625 L 62.207031 7.257812 C 64.726562 9.804688 64.726562 13.902344 62.207031 16.449219 Z M 62.207031 16.449219' />
    </g>
  </svg>
)

export default PencilIcon