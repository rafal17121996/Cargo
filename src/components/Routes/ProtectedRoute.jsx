import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const storedData = sessionStorage.getItem('userData');
  const userData = storedData ? JSON.parse(storedData) : null;

  if (!userData || userData.role !== 'Dispatcher') {
    return <Navigate to="/" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
