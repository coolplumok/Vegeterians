const UnderlineIcon = ({
  className = '',
  size = '16px',
  title = 'Underline',
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
      <path d='M 16 24.890625 C 21.894531 24.890625 26.667969 20.117188 26.667969 14.222656 L 26.667969 0 L 22.222656 0 L 22.222656 14.222656 C 22.222656 17.664062 19.441406 20.445312 16 20.445312 C 12.558594 20.445312 9.777344 17.664062 9.777344 14.222656 L 9.777344 0 L 5.332031 0 L 5.332031 14.222656 C 5.332031 20.117188 10.105469 24.890625 16 24.890625 Z M 16 24.890625' />
      <path d='M 3.554688 28.445312 L 28.445312 28.445312 L 28.445312 32 L 3.554688 32 Z M 3.554688 28.445312' />
    </g>
  </svg>
)

export default UnderlineIcon