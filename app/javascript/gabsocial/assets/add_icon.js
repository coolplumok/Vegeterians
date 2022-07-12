const AddIcon = ({
  className = '',
  size = '16px',
  title = 'Add',
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
      <path d='M 61.5 29.5 L 34.5 29.5 L 34.5 2.5 C 34.5 1.12 33.38 0 32 0 C 30.62 0 29.5 1.12 29.5 2.5 L 29.5 29.5 L 2.5 29.5 C 1.12 29.5 0 30.62 0 32 C 0 33.38 1.12 34.5 2.5 34.5 L 29.5 34.5 L 29.5 61.5 C 29.5 62.88 30.62 64 32 64 C 33.38 64 34.5 62.88 34.5 61.5 L 34.5 34.5 L 61.5 34.5 C 62.88 34.5 64 33.38 64 32 C 64 30.62 62.88 29.5 61.5 29.5 Z M 61.5 29.5' />
    </g>
  </svg>
)

export default AddIcon