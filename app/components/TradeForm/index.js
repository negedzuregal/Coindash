/**
*
* InvestmentForm
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';
import Form from "react-jsonschema-form";

class TradeForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.tradeForm}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

export default TradeForm;
