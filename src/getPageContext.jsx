/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

// a theme with custom primary and secondary color.
// it's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f28411",
      contrastText: "#fff"
    },
    secondary: {
      main: "#fff"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    }
  },
  typography: {}
});

function createPageContext() {
  return {
    theme,
    // this is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // this is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // the standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
