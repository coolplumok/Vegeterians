const TextSizeIcon = ({
  className = '',
  size = '16px',
  title = 'Text Size',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 34 32'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 0 16.84375 L 5.050781 16.84375 L 5.050781 28.632812 L 10.105469 28.632812 L 10.105469 16.84375 L 15.15625 16.84375 L 15.15625 11.789062 L 0 11.789062 Z M 0 16.84375 '/>
      <path d='M 10.105469 3.367188 L 10.105469 8.421875 L 18.527344 8.421875 L 18.527344 28.632812 L 23.578125 28.632812 L 23.578125 8.421875 L 32 8.421875 L 32 3.367188 Z M 10.105469 3.367188 '/>
    </g>
  </svg>
)

export default TextSizeIcon