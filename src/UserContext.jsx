import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  let userType = sessionStorage.getItem("userType");
  let storedUserId = sessionStorage.getItem(`${userType}Id`);
  useEffect(() => {
    // Check if user is logged in (use actual auth check)
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a guest user ID
      const guestId = `guest_${Math.floor(1000 + Math.random() * 9000)}`;
      sessionStorage.setItem("userId", guestId);
      setUserId(guestId);
    }
  }, [storedUserId]);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
