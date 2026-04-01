import React, { lazy, Suspense } from "react";

import { Route, Routes } from "react-router-dom";

import classes from "./App.module.scss";
//import Chat from "./containers/Chat/Chat";
import Home from "./containers/Home/Home";
import Loading from "./pages/Loading/Loading";
import { useAppSelector } from "./store/ReduxHooks";
import { apiRefresh } from "./client/ApiClient";
import { AxiosError, HttpStatusCode } from "axios";
import { useDispatch } from "react-redux";
import { AuthActions } from "./store/slices/AuthSlice";
import { useQuery } from "@tanstack/react-query";

/* const Home = lazy(() => {
  return import("./containers/Home/Home");
}); */
const Chat = lazy(() => {
  return import("./containers/Chat/Chat");
});

function App() {
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["refresh"],
    queryFn: () => apiRefresh(),
    select: (res) => res.data,
  });

  React.useEffect(() => {
    if (data) dispatch(AuthActions.login(data));
  }, [data]);

  const MainElement = userData ? <Chat /> : <Home />;
  return (
    <div className={classes.App}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/*" element={MainElement} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
