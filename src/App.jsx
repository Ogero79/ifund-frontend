import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterStep1 from './pages/RegisterStep1';
import RegisterStep2 from './pages/RegisterStep2';
import RegisterStep3 from './pages/RegisterStep3';
import RegisterStep4 from './pages/RegisterStep4';
import UserHomepage from './pages/UserHomepage';
import SavingsPage from './pages/SavingsPage';
import Communities from './pages/Communities';
import Notification from './pages/Notifications';
import Help from './pages/Help';
import Feedback from './pages/Feedback';
import Transactions from './pages/Transactions';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import LoansPage from './pages/LoansPage';
import InviteFriendsPage from './pages/InviteFriendsPage';
import AddSavingGoalPage from './pages/AddSavingGoalPage.';
import GoalDetailPage from './pages/GoalDetailPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/Profile';
import Account from './pages/Account';
import Theme from './pages/Theme';
import Privacy from './pages/Privacy';
import NotificationPreferences from './pages/NotificationPreferences';
import TwoStepVerification from './pages/TwoStepVerification';
import UsersList from './pages/UsersList';
import ActiveUsersList from './pages/ActiveUsersList';
import InactiveUsersList from './pages/InactiveUsersList';
import IncompleteRegistrations from './pages/IncompleteRegistrations';
import DeleteRequests from './pages/DeleteRequests';
import LoanRequestsPage from './pages/LoanRequests';
import InterestsPage from './pages/InterestsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/step-1" element={<RegisterStep1 />} />
        <Route path="/register/step-2" element={<RegisterStep2 />} />
        <Route path="/register/step-3" element={<RegisterStep3 />} />
        <Route path="/register/step-4" element={<RegisterStep4 />} />
        <Route path="/user/home" element={<UserHomepage />} />
        <Route path="/user/savings" element={<SavingsPage />} />
        <Route path="/user/communities" element={<Communities />} />
        <Route path="/user/notifications" element={<Notification />} />
        <Route path="/user/help" element={<Help />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/user/transactions" element={<Transactions />} />
        <Route path="/user/deposit" element={<DepositPage />} />
        <Route path="/user/withdraw" element={<WithdrawPage />} />
        <Route path="/user/loans" element={<LoansPage />} />
        <Route path="/invite" element={<InviteFriendsPage />} />
        <Route path="/user/add-goal" element={<AddSavingGoalPage />} />
        <Route path="/user/goal/:goalId" element={<GoalDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/notification-preferences" element={<NotificationPreferences />} />
        <Route path="/verify-code" element={<TwoStepVerification />} />
        <Route path="/superadmin/users-list" element={<UsersList />} />
        <Route path="/superadmin/active-users-list" element={<ActiveUsersList />} />
        <Route path="/superadmin/inactive-users-list" element={<InactiveUsersList />} />
        <Route path="/superadmin/incomplete-registrations" element={<IncompleteRegistrations />} />
        <Route path="/superadmin/delete-requests" element={<DeleteRequests />} />
        <Route path="/superadmin/loan-requests" element={<LoanRequestsPage />} />
        <Route path="/superadmin/interests" element={<InterestsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
