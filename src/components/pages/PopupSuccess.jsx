import React, { useState } from "react";

const PopupSuccess = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000); // Popup will auto-close after 3 seconds
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleShowPopup}
        className="btn btn-success shadow-lg"
      >
        Show Success Alert
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-green-500 text-2xl font-bold text-center">
              Success!
            </h2>
            <p className="text-gray-700 mt-4 text-center">
              Your action has been completed successfully.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="btn btn-primary mt-6 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupSuccess;
