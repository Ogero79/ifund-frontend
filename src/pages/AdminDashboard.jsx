import { Card, Button} from "react-bootstrap";
import { Line } from "react-chartjs-2";

const AdminDashboard = () => {
  const balanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Balance Summary",
        data: [50000, 60000, 55000, 70000, 65000, 80000, 75000, 85000, 90000, 95000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-4 gap-4">
        <Card>
        <i className="bi bi-people-fill"></i>
          <h3 className="text-xl font-bold">Total Users</h3>
          <p className="text-lg">1,250</p>
        </Card>
        <Card>
        <i className="bi bi-people-fill"></i>
          <h3 className="text-xl font-bold">Total Deposits</h3>
          <p className="text-lg">$95,230</p>
        </Card>
        <Card>
        <i className="bi bi-people-fill"></i>
          <h3 className="text-xl font-bold">Pending Withdrawals</h3>
          <p className="text-lg">$5,320</p>
        </Card>
        <Card>
        <i className="bi bi-people-fill"></i>
          <h3 className="text-xl font-bold">Loan Requests</h3>
          <p className="text-lg">320</p>
        </Card>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold">Balance Summary</h3>
        <Line data={balanceData} />
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <ul>
            <li>Deposit - $1,500</li>
            <li>Withdrawal - $200</li>
            <li>Loan Repayment - $300</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-bold">User Growth</h3>
          <p>+250 new users this month</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
