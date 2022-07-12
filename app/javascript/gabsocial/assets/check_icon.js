const CheckIcon = ({
  className = '',
  size = '16px',
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
    viewBox='0 0 32 32'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 31.53125 4.71875 C 30.90625 4.09375 29.894531 4.09375 29.269531 4.71875 L 10.101562 23.886719 L 2.730469 16.519531 C 2.105469 15.894531 1.09375 15.894531 0.46875 16.519531 C -0.15625 17.144531 -0.15625 18.15625 0.46875 18.78125 L 8.96875 27.28125 C 9.59375 27.90625 10.605469 27.90625 11.230469 27.28125 L 31.53125 6.980469 C 32.15625 6.355469 32.15625 5.34375 31.53125 4.71875 Z M 31.53125 4.71875' />
    </g>
  </svg>
)

export default CheckIcon