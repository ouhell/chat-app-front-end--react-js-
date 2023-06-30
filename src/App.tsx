import { lazy, Suspense } from "react";

import { Route, Routes } from "react-router-dom";

import classes from "./App.module.scss";
//import Chat from "./containers/Chat/Chat";
import Home from "./containers/Home/Home";
import Loading from "./pages/Loading/Loading";
import { useAppSelector } from "./store/ReduxHooks";

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 3000);
  });
}

/* const Home = lazy(() => {
  return import("./containers/Home/Home");
}); */
const Chat = lazy(() => {
  return import("./containers/Chat/Chat");
});

function App() {
  const userData = useAppSelector((state) => state.auth.userData);

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
