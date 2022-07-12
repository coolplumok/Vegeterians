const AddImageIcon = ({
  className = '',
  size = '16px',
  title = 'Add image',
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
      <path d='M 28.519531 22.046875 C 28.519531 24.472656 26.550781 26.441406 24.121094 26.441406 C 21.695312 26.441406 19.726562 24.472656 19.726562 22.046875 C 19.726562 19.617188 21.695312 17.648438 24.121094 17.648438 C 26.550781 17.648438 28.519531 19.617188 28.519531 22.046875 Z M 28.519531 22.046875 '/>
      <path d='M 60.214844 38.230469 C 58.136719 36.273438 55.511719 34.992188 52.640625 34.625 L 52.640625 12.273438 C 52.640625 9.894531 51.664062 7.753906 50.136719 6.167969 C 48.550781 4.582031 46.414062 3.664062 44.03125 3.664062 L 8.609375 3.664062 C 6.230469 3.664062 4.089844 4.640625 2.503906 6.167969 C 0.917969 7.753906 0 9.894531 0 12.273438 L 0 48.734375 C 0 51.113281 0.976562 53.25 2.503906 54.839844 C 4.089844 56.425781 6.230469 57.34375 8.609375 57.34375 L 42.871094 57.34375 C 45.128906 59.175781 47.9375 60.335938 51.054688 60.335938 C 54.65625 60.335938 57.894531 58.871094 60.214844 56.550781 C 62.535156 54.230469 64 50.992188 64 47.390625 C 64 43.785156 62.535156 40.550781 60.214844 38.230469 Z M 3.238281 12.273438 C 3.238281 10.808594 3.847656 9.464844 4.824219 8.488281 C 5.800781 7.511719 7.144531 6.902344 8.609375 6.902344 L 44.03125 6.902344 C 45.496094 6.902344 46.839844 7.511719 47.816406 8.488281 C 48.792969 9.464844 49.40625 10.808594 49.40625 12.273438 L 49.40625 31.328125 L 40.367188 22.351562 C 39.753906 21.742188 38.71875 21.679688 38.046875 22.351562 L 24.425781 36.03125 L 15.207031 26.75 C 14.59375 26.136719 13.558594 26.078125 12.886719 26.75 L 3.238281 36.519531 Z M 8.550781 54.167969 L 8.550781 54.105469 C 7.082031 54.105469 5.742188 53.496094 4.761719 52.519531 C 3.847656 51.542969 3.238281 50.199219 3.238281 48.734375 L 3.238281 41.097656 L 14.105469 30.230469 L 23.328125 39.449219 C 23.9375 40.0625 24.976562 40.0625 25.648438 39.449219 L 39.265625 25.769531 L 48.183594 34.75 C 48 34.808594 47.816406 34.871094 47.632812 34.929688 C 47.390625 34.992188 47.144531 35.054688 46.839844 35.175781 C 46.59375 35.238281 46.351562 35.359375 46.105469 35.417969 C 45.921875 35.480469 45.800781 35.542969 45.617188 35.664062 C 45.375 35.785156 45.191406 35.847656 45.007812 35.96875 C 44.703125 36.152344 44.398438 36.335938 44.089844 36.519531 C 43.910156 36.640625 43.785156 36.703125 43.601562 36.824219 C 43.480469 36.886719 43.417969 36.945312 43.296875 37.007812 C 42.75 37.375 42.257812 37.800781 41.832031 38.289062 C 39.511719 40.609375 38.046875 43.847656 38.046875 47.449219 C 38.046875 48.367188 38.167969 49.222656 38.351562 50.136719 C 38.414062 50.382812 38.472656 50.566406 38.535156 50.808594 C 38.71875 51.417969 38.902344 52.03125 39.144531 52.640625 L 39.144531 52.703125 C 39.390625 53.191406 39.632812 53.742188 39.9375 54.167969 Z M 57.832031 54.230469 C 56.0625 56 53.679688 57.039062 50.992188 57.039062 C 48.425781 57.039062 46.046875 56 44.335938 54.351562 C 44.089844 54.105469 43.847656 53.800781 43.601562 53.558594 C 43.417969 53.375 43.238281 53.128906 43.054688 52.945312 C 42.808594 52.640625 42.625 52.273438 42.441406 51.910156 C 42.320312 51.664062 42.199219 51.480469 42.078125 51.238281 C 41.953125 50.929688 41.832031 50.566406 41.769531 50.199219 C 41.710938 49.953125 41.585938 49.648438 41.527344 49.40625 C 41.40625 48.792969 41.34375 48.121094 41.34375 47.449219 C 41.34375 44.761719 42.441406 42.382812 44.152344 40.609375 C 45.921875 38.839844 48.304688 37.800781 50.992188 37.800781 C 53.679688 37.800781 56.0625 38.902344 57.832031 40.609375 C 59.601562 42.320312 60.640625 44.761719 60.640625 47.449219 C 60.640625 50.078125 59.542969 52.457031 57.832031 54.230469 Z M 57.832031 54.230469 '/>
      <path d='M 56.304688 45.742188 L 52.582031 45.742188 L 52.582031 42.015625 C 52.582031 41.097656 51.847656 40.367188 50.929688 40.367188 C 50.015625 40.367188 49.28125 41.097656 49.28125 42.015625 L 49.28125 45.742188 L 45.558594 45.742188 C 44.640625 45.742188 43.910156 46.472656 43.910156 47.390625 C 43.910156 48.304688 44.640625 49.039062 45.558594 49.039062 L 49.28125 49.039062 L 49.28125 52.761719 C 49.28125 53.679688 50.015625 54.414062 50.929688 54.414062 C 51.847656 54.414062 52.582031 53.679688 52.582031 52.761719 L 52.582031 49.039062 L 56.304688 49.039062 C 57.222656 49.039062 57.953125 48.304688 57.953125 47.390625 C 57.953125 46.472656 57.222656 45.742188 56.304688 45.742188 Z M 56.304688 45.742188 '/>
    </g>
  </svg>
)

export default AddImageIcon