import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Alert } from 'components';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Alert />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
