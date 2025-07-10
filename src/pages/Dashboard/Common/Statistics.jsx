import AdminStatistics from '../../../components/Dashboard/Statistics/AdminStatistics'
import CustomerStatistics from '../../../components/Dashboard/Statistics/CustomerStatistics';
import SellerStatistic from '../../../components/Dashboard/Statistics/SellerStatistic';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useRole from '../../../hooks/useRole'
const Statistics = () => {
  const [role, isLoading] = useRole();

  if(isLoading) return <LoadingSpinner></LoadingSpinner>
  return (
    <div>
      {role === "admin" && <AdminStatistics />}
      {role === "seller" && <SellerStatistic />}
      {role === "customer" && <CustomerStatistics />}
      
    </div>
  )
}

export default Statistics
