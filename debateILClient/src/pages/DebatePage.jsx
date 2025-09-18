import { useState, useRef, useEffect } from "react";

export default function DebatePage() {
  // Demo users
  const user1 = {
    id: 1,
    firstName: "Alice",
    avatar: "", // Place for image in the future
  };
  const user2 = {
    id: 2,
    firstName: "Bob",
    avatar: "",
  };
  // Audience with image placeholder (avatar field for future image)
  const audience = [
    { id: 101, avatar: "" },
    { id: 102, avatar: "" },
    { id: 103, avatar: "" },
    { id: 104, avatar: "" },
    { id: 105, avatar: "" },
  ];

  // Demo arguments
  const [debateArguments, setDebateArguments] = useState([
    { id: 1, user: user1, text: "Hello! I believe that..." },
    { id: 2, user: user2, text: "I disagree, because..." },
    { id: 3, user: user1, text: "But consider this..." },
    { id: 4, user: user2, text: "Good point, but still..." },
  ]);
  const [newArgument, setNewArgument] = useState("");
  const [currentUser, setCurrentUser] = useState(user1); // Switch to user2 for testing

  // Demo votes
  const [votes, setVotes] = useState({ user1: 7, user2: 3 });
  const [hasVoted, setHasVoted] = useState(false);

  // Auto scroll
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debateArguments]);

  // Vote bar calculation
  const totalVotes = votes.user1 + votes.user2;
  const user1Percent = totalVotes ? Math.round((votes.user1 / totalVotes) * 100) : 50;
  const user2Percent = totalVotes ? Math.round((votes.user2 / totalVotes) * 100) : 50;

  // Add argument
  const handleAddArgument = (e) => {
    e.preventDefault();
    if (!newArgument.trim()) return;
    setDebateArguments((prev) => [
      ...prev,
      { id: prev.length + 1, user: currentUser, text: newArgument },
    ]);
    setNewArgument("");
  };

  // Vote
  const handleVote = (side) => {
    if (hasVoted) return;
    setVotes((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
    setHasVoted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-gray-100">
      {/* Vote Bar */}
      <div className="w-full max-w-4xl mx-auto mt-8 mb-4">
        <div className="flex h-10 rounded-full overflow-hidden shadow-2xl border-4 border-gray-300 relative">
          <div
            className="flex items-center justify-end pr-4 text-white font-extrabold text-lg bg-blue-700 transition-all"
            style={{ width: `${user1Percent}%` }}
          >
            {user1.firstName} {user1Percent}%
          </div>
          <div
            className="flex items-center justify-start pl-4 text-white font-extrabold text-lg bg-red-700 transition-all"
            style={{ width: `${user2Percent}%` }}
          >
            {user2Percent}% {user2.firstName}
          </div>
        </div>
      </div>

      {/* Debaters Avatars - OUTSIDE the ring */}
      <div className="w-full max-w-4xl mx-auto flex flex-row justify-between items-center px-8 mb-2" style={{marginTop: 0}}>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white border-8 border-blue-700 flex items-center justify-center text-5xl shadow-2xl ring-4 ring-blue-200">
            {user1.avatar ? (
              <img src={user1.avatar} alt="user1" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-blue-300">+</span>
            )}
          </div>
          <div className="text-center font-extrabold text-blue-700 text-lg tracking-wide drop-shadow-lg mt-2">{user1.firstName}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white border-8 border-red-700 flex items-center justify-center text-5xl shadow-2xl ring-4 ring-red-200">
            {user2.avatar ? (
              <img src={user2.avatar} alt="user2" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-red-300">+</span>
            )}
          </div>
          <div className="text-center font-extrabold text-red-700 text-lg tracking-wide drop-shadow-lg mt-2">{user2.firstName}</div>
        </div>
      </div>

      {/* Main Debate Arena */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Boxing ring frame */}
        <div
          className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-6 px-2"
          style={{
            border: "6px solid #222",
            borderRadius: "2.5rem",
            boxShadow: "0 0 0 8px #e0e7ef, 0 8px 32px 0 rgba(0,0,0,0.10)",
            background: "linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)",
            position: "relative",
            minHeight: "38vh",
            maxHeight: "38vh",
            overflow: "hidden",
            marginBottom: "0.5rem"
          }}
        >
          {/* Chat Area */}
          <div className="relative w-full flex flex-col items-center h-full">
            <div
              className="flex flex-col-reverse overflow-y-auto w-full h-full px-2 py-2"
              style={{
                scrollbarWidth: "none",
                background: "transparent",
                minWidth: "260px",
                maxHeight: "32vh",
              }}
            >
              <div ref={chatEndRef}></div>
              {debateArguments.length > 0 ? (
                debateArguments
                  .slice()
                  .reverse()
                  .map((argument) => (
                    <div
                      key={argument.id}
                      className={`flex items-end mb-4 ${
                        argument.user.id === user1.id ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Bubble + Avatar */}
                      {argument.user.id === user1.id && (
                        <>
                          <div className="flex items-end">
                            <div className="rounded-3xl bg-blue-100 px-6 py-3 shadow text-left max-w-xs mr-2 text-base border-2 border-blue-300 text-blue-900 font-semibold">
                              <div className="mb-1 text-blue-700 font-bold">{argument.user.firstName}</div>
                              <div>{argument.text}</div>
                            </div>
                          </div>
                        </>
                      )}
                      {argument.user.id === user2.id && (
                        <>
                          <div className="rounded-3xl bg-red-100 px-6 py-3 shadow text-right max-w-xs ml-2 text-base border-2 border-red-300 text-red-900 font-semibold">
                            <div className="mb-1 text-red-700 font-bold">{argument.user.firstName}</div>
                            <div>{argument.text}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-gray-400 text-center py-8">No arguments yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input box BELOW the ring */}
      <form
        onSubmit={handleAddArgument}
        className="w-full max-w-4xl mx-auto flex items-center justify-center px-2 pb-2 mt-2"
        style={{ pointerEvents: "auto" }}
      >
        <input
          type="text"
          value={newArgument}
          onChange={(e) => setNewArgument(e.target.value)}
          placeholder="Type your argument..."
          className={`flex-1 px-5 py-3 border-2 rounded-full text-base shadow-lg bg-white focus:outline-none ${
            currentUser.id === user1.id
              ? "border-blue-700 focus:ring-2 focus:ring-blue-400"
              : "border-red-700 focus:ring-2 focus:ring-red-400"
          }`}
          style={{ maxWidth: 600 }}
        />
        <button
          type="submit"
          className={`ml-2 px-6 py-3 rounded-full font-extrabold text-base shadow ${
            currentUser.id === user1.id
              ? "bg-blue-700 text-white hover:bg-blue-900"
              : "bg-red-700 text-white hover:bg-red-900"
          } transition`}
        >
          Send
        </button>
      </form>

      {/* Audience & Voting */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-4 pb-4">
        <div className="flex items-center gap-6 mb-6">
          {audience.map((a) => (
            <span
              key={a.id}
              className="w-20 h-20 rounded-full bg-white border-8 border-gray-400 flex items-center justify-center text-4xl shadow-lg"
              title={`Audience #${a.id}`}
            >
              {a.avatar ? (
                <img src={a.avatar} alt={`Audience #${a.id}`} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-gray-300">+</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-10">
          <button
            className="bg-blue-700 text-white px-10 py-3 rounded-full text-xl font-extrabold shadow-xl hover:bg-blue-900 transition"
            disabled={hasVoted}
            onClick={() => handleVote("user1")}
          >
            Vote {user1.firstName}
          </button>
          <button
            className="bg-red-700 text-white px-10 py-3 rounded-full text-xl font-extrabold shadow-xl hover:bg-red-900 transition"
            disabled={hasVoted}
            onClick={() => handleVote("user2")}
          >
            Vote {user2.firstName}
          </button>
        </div>
      </div>
    </div>
  );
}