// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/Topbar";

// const AppLayout = () => {
//   const [selectedWorkSpace, setSelectedWorkSpace] = useState(null);
//   const [workspaceData, setWorkspaceData] = useState(null);

//   const fetchWorkspace = async () => {
//     try {
//       const res = await fetch(
//         `${
//           import.meta.env.VITE_BACKEND_URL
//         }/api/workspaces/workspace/${selectedWorkSpace}`
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setWorkspaceData(data.workspace);
//       } else {
//         console.error("Failed to fetch workspace:", data.message);
//       }
//     } catch (err) {
//       console.error("Error fetching workspace:", err);
//     }
//   };

//   useEffect(() => {
//     fetchWorkspace();
//   }, [selectedWorkSpace]);

//   return (
//     <div className="app-container">
//       <Sidebar
//         selectedWorkSpace={selectedWorkSpace}
//         setSelectedWorkSpace={setSelectedWorkSpace}
//         workspaceData={workspaceData}
//         setWorkspaceData={setWorkspaceData}
//       />
//       <div className="main-content">
//         <TopBar
//           selectedWorkSpace={selectedWorkSpace}
//           setSelectedWorkSpace={setSelectedWorkSpace}
//           workspaceData={workspaceData}
//           setWorkspaceData={setWorkspaceData}
//         />
//         <div className="app-content">
//           <Outlet
//             context={{
//               selectedWorkSpace,
//               setSelectedWorkSpace,
//               workspaceData,
//               setWorkspaceData,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const AppLayout = () => {
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(
    () => localStorage.getItem("selectedWorkSpace") || null
  );
  const [workspaceData, setWorkspaceData] = useState(null);

  const fetchWorkspace = async () => {
    if (!selectedWorkSpace) return;
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/workspace/${selectedWorkSpace}`
      );
      const data = await res.json();
      if (res.ok) {
        setWorkspaceData(data.workspace);
      } else {
        console.error("Failed to fetch workspace:", data.message);
      }
    } catch (err) {
      console.error("Error fetching workspace:", err);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [selectedWorkSpace]);

  // 🔹 Save selected workspace whenever it changes
  useEffect(() => {
    if (selectedWorkSpace) {
      localStorage.setItem("selectedWorkSpace", selectedWorkSpace);
    }
  }, [selectedWorkSpace]);

  return (
    <div className="app-container">
      <Sidebar
        selectedWorkSpace={selectedWorkSpace}
        setSelectedWorkSpace={setSelectedWorkSpace}
        workspaceData={workspaceData}
        setWorkspaceData={setWorkspaceData}
      />
      <div className="main-content">
        <TopBar
          selectedWorkSpace={selectedWorkSpace}
          setSelectedWorkSpace={setSelectedWorkSpace}
          workspaceData={workspaceData}
          setWorkspaceData={setWorkspaceData}
        />
        <div className="app-content">
          <Outlet
            context={{
              selectedWorkSpace,
              setSelectedWorkSpace,
              workspaceData,
              setWorkspaceData,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
