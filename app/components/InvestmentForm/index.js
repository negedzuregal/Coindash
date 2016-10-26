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

class InvestmentForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.investmentForm}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

export default InvestmentForm;
