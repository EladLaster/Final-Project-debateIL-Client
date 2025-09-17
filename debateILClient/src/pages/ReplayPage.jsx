import { useParams } from "react-router-dom";
import {
  getDebateById,
  getDebateParticipants,
  getArgumentsWithUserInfo,
  getAvatarById,
} from "../data/mockData";

export default function ReplayPage() {
  const { id } = useParams();
  const debateId = Number(id);
  const debate = getDebateById(debateId);
  const { user1, user2 } = getDebateParticipants(debateId);
  const argumentsList = getArgumentsWithUserInfo(debateId);

  if (!debate) {
    return (
      <div className="p-8 text-center text-gray-500">Debate not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Replay: {debate.topic}
      </h2>
      <div className="bg-gray-50 rounded-xl p-4 shadow space-y-4">
        {argumentsList.map((arg, idx) => {
          // user1 תמיד בצד שמאל, user2 תמיד בצד ימין
          const isUser1 = arg.user?.id === user1?.id;
          return (
            <div
              key={arg.id}
              className={`chat ${isUser1 ? "chat-start" : "chat-end"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Chat avatar" src={getAvatarById(arg.user?.id)} />
                </div>
              </div>
              <div className="chat-header">
                {arg.user?.firstName}
                <time className="text-xs opacity-50">
                  {new Date(arg.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isUser1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {arg.text}
              </div>
              <div className="chat-footer opacity-50">
                {idx === argumentsList.length - 1 ? "Delivered" : "Seen"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
