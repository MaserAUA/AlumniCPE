import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Event from "../public/Event";
import Comming from "../public/Coming";


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
  
  return (
    <div className="bg-white min-h-screen">
      {/* ลบ NavbarUser จากที่นี่เพราะมีใน PrivateLayout แล้ว */}
      <section id="event" className="py-8">
        <Event posts={posts}/>
      </section>
      <section id="comming" className="py-8">
        <Comming posts={posts}/>
      </section>
      {/* ลบ FooterUser จากที่นี่เพราะมีใน PrivateLayout แล้ว */}
    </div>
  );
};

export default Homeuser;