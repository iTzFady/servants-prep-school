import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { store } from "../store/store";
import { queryClient } from "../services/queryClient";
import { initializeAuth } from "../store/authSlice";
import { secureStore } from "../services/secureStore";
import { useAppDispatch } from "../store/hooks";
import { setSentryUser, clearSentryUser } from "../services/sentryClient";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreAuth = async () => {
      const token = await secureStore.getToken();
      const user = await secureStore.getUser();
      dispatch(initializeAuth({ token, user }));

      if (user?.id) {
        setSentryUser(user.id, {
          email: user.email,
          role: user.role,
        });
      } else {
        clearSentryUser();
      }

      setReady(true);
    };
    restoreAuth();
  }, [dispatch]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthInitializer>
    </Provider>
  );
}

export default AppProviders;
