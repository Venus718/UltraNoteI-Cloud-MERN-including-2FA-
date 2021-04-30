/**
 *
 * SignupPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SignupPage() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

SignupPage.propTypes = {};

export default memo(SignupPage);
