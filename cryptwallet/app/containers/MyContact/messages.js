/*
 * MyContact Messages
 *
 * This contains all the text for the MyContact container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.MyContact';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the MyContact container!',
  },
});
