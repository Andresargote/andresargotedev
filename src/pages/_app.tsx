import '../styles/global.scss';

import Header from '../components/Header';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Component {...pageProps} />  
      </div>
    </>
  )
    
}

export default MyApp
