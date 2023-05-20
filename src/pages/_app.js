import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import '@/styles/global.scss'

export default function App ( { Component,pageProps } ) {
  return <Component { ...pageProps } />
}
