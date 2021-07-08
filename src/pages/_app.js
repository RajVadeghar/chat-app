import { ThemeProvider } from "../contexts/ThemeContext";
import "../styles/globals.css";
import { Provider } from "next-auth/client";
import { SidebarProvider } from "../contexts/SidebarContext";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
