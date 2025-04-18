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
     
      <section id="event" >
        <Event posts={posts}/>
      </section>
      <section id="comming" >
        <Comming posts={posts}/>
      </section>
      
    </div>
  );
};

export default Homeuser;