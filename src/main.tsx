

import * as ReactDOM from 'react-dom/client';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
// import theme, { globalStyles } from './theme/theme';
import App from './App';


// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ThemeProvider theme={theme}>
//       <CssBaseline>
//         {globalStyles}
//       </CssBaseline>
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>,
// );


ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />,
);