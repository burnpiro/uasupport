import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import i18n from '../i18n';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      const errorMessage = this.props.ErrorMessage
        ? i18n.t(this.props.ErrorMessage)
        : i18n.t('UnexpectedError');
      // You can render any custom fallback UI
      return (
        <Alert severity="error">
          <AlertTitle>{i18n.t('Error')}</AlertTitle>
          {errorMessage}
        </Alert>
      );
    }

    return this.props.children;
  }
}
