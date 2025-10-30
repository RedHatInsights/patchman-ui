import { intl } from './IntlProvider';
import messages from '../Messages';

/*
validates date of a type YYYY-MM-DD with starting limit 1990-01-01.
regex is used to comply the Patternfly date format.
*/
const dateValidator = (dateStr) => {
  const regex = /^(\d{4})-(0[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

  if (dateStr && typeof dateStr === 'string' && dateStr.match(regex) === null) {
    return intl.formatMessage(messages.labelsErrorInvalidDate);
  }

  const date = new Date(dateStr);
  const timestamp = date.getTime();

  // Month had to be set to equal 0 to get the first month of the year.
  const minDate = new Date(1990, 0, 1);

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return intl.formatMessage(messages.labelsErrorInvalidDate);
  }

  if (date < minDate) {
    return intl.formatMessage(messages.labelsErrorDateLimit);
  }

  return;
};

export default dateValidator;
