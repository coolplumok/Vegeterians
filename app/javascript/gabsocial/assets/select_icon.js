const SelectIcon = ({
  className = '',
  size = '16px',
  title = 'Select',
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
      <path d="M 8.535156 14.222656 L 23.464844 14.222656 C 24.070312 14.222656 24.625 13.890625 24.90625 13.355469 C 25.1875 12.820312 25.148438 12.175781 24.808594 11.675781 L 17.25 0.632812 C 16.980469 0.238281 16.53125 0.00390625 16.054688 0 C 15.574219 0 15.125 0.234375 14.851562 0.625 L 7.195312 11.667969 C 6.851562 12.167969 6.8125 12.816406 7.09375 13.351562 C 7.375 13.886719 7.929688 14.222656 8.535156 14.222656 Z M 8.535156 14.222656" />
      <path d="M 23.464844 17.777344 L 8.535156 17.777344 C 7.929688 17.777344 7.375 18.113281 7.09375 18.648438 C 6.8125 19.183594 6.851562 19.832031 7.195312 20.332031 L 14.851562 31.375 C 15.125 31.765625 15.574219 32 16.054688 32 C 16.53125 31.996094 16.980469 31.761719 17.25 31.367188 L 24.808594 20.324219 C 25.148438 19.824219 25.1875 19.179688 24.90625 18.644531 C 24.625 18.109375 24.070312 17.777344 23.464844 17.777344 Z M 23.464844 17.777344" />
    </g>
  </svg>
)

export default SelectIcon