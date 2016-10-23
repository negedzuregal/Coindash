/*
 *
 * Investments
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';
import { InvestmentEngine } from '../../utils/Wallet/InvestmentEngine';
import Wallet from '../../utils/Wallet/Wallet';

export class Investments extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {    
    super(props);
    this.state = {

    };
  }

  componentDidMount() {    
    let engine = new InvestmentEngine(Wallet);
    engine.fetchInvestmentsForAccount(Wallet.walletAddresses[0],
      function(investments, error) {

      });
  }

  render() {
    return (
      <div className={styles.investments}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Investments);
