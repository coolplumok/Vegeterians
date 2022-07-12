const LoadingIcon = ({
  className = '',
  size = '24px',
}) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    style={{shapeRendering: 'auto'}}
    width={size}
    height={size}
    viewBox='0 0 100 100'
    preserveAspectRatio='xMidYMid'
  >
    <g transform='translate(82,50)'>
      <g transform='rotate(0)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='1' transform='scale(1.03405 1.03405)'>
          <animateTransform attributeName='transform' type='scale' begin='-1.0294117647058822s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-1.0294117647058822s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(72.62741699796952,72.62741699796952)'>
      <g transform='rotate(45)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.875' transform='scale(1.09655 1.09655)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.8823529411764705s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.8823529411764705s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(50,82)'>
      <g transform='rotate(90)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.75' transform='scale(1.15905 1.15905)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.7352941176470588s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.7352941176470588s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(27.37258300203048,72.62741699796952)'>
      <g transform='rotate(135)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.625' transform='scale(1.22155 1.22155)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.588235294117647s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.588235294117647s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(18,50)'>
      <g transform='rotate(180)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.5' transform='scale(1.28405 1.28405)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.4411764705882352s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.4411764705882352s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(27.372583002030474,27.37258300203048)'>
      <g transform='rotate(225)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.375' transform='scale(1.34655 1.34655)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.2941176470588235s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.2941176470588235s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(50,18)'>
      <g transform='rotate(270)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.25' transform='scale(1.40905 1.40905)'>
          <animateTransform attributeName='transform' type='scale' begin='-0.14705882352941174s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='-0.14705882352941174s'></animate>
        </circle>
      </g>
    </g>
    <g transform='translate(72.62741699796952,27.372583002030474)'>
      <g transform='rotate(315)'>
        <circle cx='0' cy='0' r='6' className={_s.fillSecondary} fillOpacity='0.125' transform='scale(1.47155 1.47155)'>
          <animateTransform attributeName='transform' type='scale' begin='0s' values='1.5 1.5;1 1' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite'></animateTransform>
          <animate attributeName='fill-opacity' keyTimes='0;1' dur='1.176470588235294s' repeatCount='indefinite' values='1;0' begin='0s'></animate>
        </circle>
      </g>
    </g>
  </svg>
)

export default LoadingIcon
