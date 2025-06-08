import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h1 className="text-5xl font-bold underline text-blue-500">{message}</h1>
    </>
  )
}

export default App
