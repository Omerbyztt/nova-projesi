import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="App">
      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Signup onSwitch={toggleAuthMode} />
      )}
    </div>
  );
}

export default App;