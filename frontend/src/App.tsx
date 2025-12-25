import { useEffect } from "react";
import DecoratorBg from "./components/DecoratorBg";
import Routes from "./Routes";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {

  const authenticate = useAuthStore((state) => state.authenticate);
  useEffect(()=>{authenticate()}, [])

  return (
      <div className="min-h-screen flex flex-col bg-gray-900 relative overflow-hidden">
        {/* Decorators */}
        <DecoratorBg/>

        {/* my app content */}
        <div className="app-content relative z-10 grow">
          <Routes />
        </div>

      </div>
  );
};

export default App;
