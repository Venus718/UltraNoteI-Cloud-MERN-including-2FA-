/**
 *
 * ResetWallet
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { Button, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Form from '../uiStyle/Form';
import FontAwesome from '../uiStyle/FontAwesome';

import messages from './messages';

import './style.scss';

function ResetWallet({
  wallet_name,
  rwModalOpen,
  rwModalCloseHandler,
  rwChangeHandler,
  rwSubmitHandler,
}) {
  return (
    <Dialog
      open={rwModalOpen}
      onClose={rwModalCloseHandler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{
        paper: 'modalPaper',
        container: 'scrollAble',
        root: 'rootDialog',
      }}
      BackdropProps={{
        className: 'backdropWrap',
      }}
    >
      <Grid className="modalInner">
        <DialogTitle className="modalHeader" id="alert-dialog-title">
          Reset Wallet
          <Typography onClick={rwModalCloseHandler} component="span">
            <FontAwesome name="times" />
          </Typography>
        </DialogTitle>
        <DialogContent className="modalCardBody">
          <Form onSubmit={rwSubmitHandler}>
            <label htmlFor="name">Name</label>
            <TextField
              id="name"
              fullWidth
              variant="outlined"
              className="input"
              name="wallet_name"
              value={wallet_name}
              onChange={rwChangeHandler}
              placeholder="Write wallet name"
            />
            <Button type="submit" className="formSubmitBtn">
              Reset
            </Button>
          </Form>
        </DialogContent>
      </Grid>
    </Dialog>
  );
}

ResetWallet.propTypes = {};

export default ResetWallet;
