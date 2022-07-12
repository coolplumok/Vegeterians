import { length } from 'stringz'

/**
 * Renders a character counter
 * @param {string} props.text - text to use to measure
 * @param {number} props.max - max text allowed
 */
export default class CharacterCounter extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
  }

  render() {
    const { text, max } = this.props

    const actualRadius = 16
    const radius = 12
    const circumference = 2 * Math.PI * radius
    const diff = Math.min(length(text), max) / max
    const dashoffset = circumference * (1 - diff)

    return (
      <div className={[_s.default, _s.mr10, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <svg
          width={actualRadius * 2}
          height={actualRadius * 2}
          viewBox={`0 0 ${actualRadius * 2} ${actualRadius * 2}`}
        >
          <circle
            fill='none'
            cx={actualRadius}
            cy={actualRadius}
            r={radius}
            fill='none'
            stroke='#e6e6e6'
            strokeWidth='2'
          />
          <circle
            style={{
              strokeDashoffset: dashoffset,
              strokeDasharray: circumference,
            }}
            fill='none'
            cx={actualRadius}
            cy={actualRadius}
            r={radius}
            strokeWidth='2'
            strokeLinecap='round'
            stroke='#E92626'
          />
        </svg>
      </div>
    )
  }

}
