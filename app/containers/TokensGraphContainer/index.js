/*
 *
 * TokensGraphContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import selectTokensGraphContainer from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';
import W from '../../utils/Wallet/Wallet'
import $ from 'jquery'; 

export class TokensGraphContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {    
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {    
    let allTokens = W.getTokens();
    for (var i = 0; i < allTokens.length; i++) {
      let token = allTokens[i];
      this.fetchDataForCoin(token.symbol);
    }
  }

  fetchDataForCoin(coinSymbol) {
    var serverUrl = "https://coinmarketcap-nexuist.rhcloud.com/api/BTC";//"http://coinmarketcap.northpole.ro/api/v5/history/" + coinSymbol + "_2016.json";
    console.log(serverUrl);
    var parentObj = this;
    $.ajax({
        url: serverUrl,
        headers: {'Content-Type': 'application/json'},
        type: 'GET',
        dataType: 'jsonp',
        success: function(data) {
          console.log(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("ERRORRRR", status, err);
        }.bind(this)
      });
  }

  render() {
    return (
      <div className={styles.tokensGraphContainer}>
        <Helmet
          title="TokensGraphContainer"
          meta={[
            { name: 'description', content: 'Description of TokensGraphContainer' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectTokensGraphContainer();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TokensGraphContainer);
