/**
 *
 * LoginPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function LoginPage() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

LoginPage.propTypes = {};

export default memo(LoginPage);
