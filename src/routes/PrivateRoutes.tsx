import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const PrivateRoutes = ({children}) => {
    const { user } = useAuth()

    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return <>{children}</>
};

export default PrivateRoutes