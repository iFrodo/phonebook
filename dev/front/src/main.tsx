import ReactDOM from 'react-dom/client'
import './style.css'
import App from './App'

const root = document.getElementById('root');
if (root) {
  const appRoot = ReactDOM.createRoot(root);
  appRoot.render(<App />);
} else {
  console.error('Root element not found.');
}