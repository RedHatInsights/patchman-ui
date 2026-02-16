import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const getWizardTitle = (wizardType) =>
  wizardType === 'edit'
    ? intl.formatMessage(messages.templateEdit)
    : intl.formatMessage(messages.templateTitle);

export const apiFailedNotification = (description) => ({
  title: 'There was an error while processing your request',
  description,
  variant: 'danger',
});
