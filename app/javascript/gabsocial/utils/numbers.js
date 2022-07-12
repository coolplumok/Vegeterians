import { Fragment } from 'react'
import { FormattedNumber } from 'react-intl'

export const shortNumberFormat = (number) => {
  if (number < 1000) {
    try {
      return (<FormattedNumber value={number} />).props.value
    } catch (error) {
      return <FormattedNumber value={number} />
    }
  }

  return (
    <Fragment>
      <FormattedNumber value={number / 1000} maximumFractionDigits={1} />k
    </Fragment>
  )
}
