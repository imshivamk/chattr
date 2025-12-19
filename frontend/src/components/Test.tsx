import { useState } from "react";

interface GreetResponse {
  greeting: string;
}

function Test() {
  const [name, setName] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        alert("Please enter a valid name");
        return;
      }

      const data :  GreetResponse = await res.json();
      setGreeting(data.greeting);


    } catch (error) {
      console.error("Error fetching greeting:", error);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Personalized Greeting App
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700"
          />

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-900 transition font-medium"
          >
            Send
          </button>
        </form>

        {greeting && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl">
            <p className="text-lg font-semibold text-gray-700">{greeting}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
