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
import SkyLight from 'react-skylight';
import InvestmentForm from 'components/InvestmentForm';

export class Investments extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {    
    super(props);
    this.state = {

    };
  }

  componentDidMount() {    
    let engine = new InvestmentEngine(Wallet);
    let account = Wallet.walletAddresses[0];
    engine.fetchInvestmentsForAccount(account,
      function(investments, error) {
        let all = engine.mergeInvestmentsToSaved(account,
                                        investments
                                      )
        console.log(all);
      });
  }

  render() {
    return (
      <div className={styles.investments}>
        <FormattedMessage {...messages.header} />
        <div>
        <br/><br/>
          <button onClick={() => this.refs.simpleDialog.show()}>Add investment</button>
          <SkyLight hideOnOverlayClicked ref="simpleDialog" title="Add investment">
          <br/><br/>
            <InvestmentForm onSubmited={this.onSubmitedInvestment.bind(this)} />
          </SkyLight>
        </div>
      </div>
    );
  }

  onSubmitedInvestment(investment) {
    console.log("onSubmited " + investment);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Investments);
