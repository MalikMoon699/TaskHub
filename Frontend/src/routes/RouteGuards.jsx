import { Navigate, useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({
  children,
  allowWithoutWorkspace = false,
  requireOwner = false,
}) => {
  const { authAllow, loading, currentUser } = useAuth();
  const { workspaceData, workspaceLoading } = useOutletContext() || {};

  if (loading)
    return (
      <Loader
        loading={true}
        size="50"
        style={{ height: "85vh", width: "100%" }}
      />
    );

  if (!authAllow) return <Navigate to="/login" replace />;

  if (
    (!currentUser?.workSpaces || currentUser.workSpaces.length === 0) &&
    !allowWithoutWorkspace
  ) {
    return <Navigate to="/workspace" replace />;
  }

  if (
    !loading &&
    !workspaceLoading &&
    requireOwner &&
    workspaceData?.createdBy !== currentUser?._id
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading)
    return (
      <Loader
        loading={true}
        size="50"
        style={{ height: "85vh", width: "100%" }}
      />
    );


  if (authAllow) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
