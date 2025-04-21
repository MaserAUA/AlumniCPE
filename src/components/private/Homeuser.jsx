import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Event from "../public/Event";
import Comming from "../public/Coming";
import { IoChatbubbleEllipses } from "react-icons/io5";

const Homeuser = ({ posts, onEditPost, onDeletePost, section }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (section) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`Section with id "${section}" not found.`);
      }
    }
  }, [section]);

  const handleChatClick = () => {
    navigate("/chatpage");
  };

  return (
    <div className="bg-white min-h-screen">
      <section id="event">
        <Event posts={posts} />
      </section>
      <section id="comming">
        <Comming posts={posts} />
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleChatClick}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
          aria-label="Open chat"
        >
          <IoChatbubbleEllipses size={28} />
        </button>
      </div>
    </div>
  );
};

export default Homeuser;
