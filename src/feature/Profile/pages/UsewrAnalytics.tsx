import React from 'react';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { Bookmark, MessageSquare, Heart, Eye, UserPlus, BarChart2 } from 'lucide-react';
import { Pics } from '../../../assets/images';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserAnalytics: React.FC = () => {
  // Sample user data
  const userData = {
    name: "John Doe",
    bio: "Tech enthusiast and content creator passionate about sharing knowledge",
    profileImage: Pics.blogPic,
    totalArticles: 45,
    totalPosts: 128,
    totalImpressions: 15432,
    totalComments: 892,
    totalEngagements: 4567,
    totalProfileValue: 234,
    totalReactions: 3876,
    totalFollows: 156
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Engagements',
      data: [500, 750, 600, 900, 800, 1200],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Added for better mobile responsiveness
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Engagement Trends'
      }
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1.66fr] min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col lg:border-r border-neutral-500">
        <Topbar>
          <p>User Analytics</p>
        </Topbar>

        {/* Analytics content - Added overflow handling */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-7xl mx-auto">
          {/* User Profile Section - Improved responsive layout */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0">
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  {userData.name}
                </h1>
                <p className="text-sm sm:text-base text-neutral-200 mb-2 sm:mb-4">
                  {userData.bio}
                </p>
                <div className="text-neutral-400 text-sm">
                  Active since: April 2023
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Improved responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard 
              icon={<BarChart2 className="text-neutral-100 size-5" />} 
              label="Total Articles" 
              value={userData.totalArticles} 
            />
            <StatCard 
              icon={<MessageSquare className="text-neutral-100 size-5" />} 
              label="Total Posts" 
              value={userData.totalPosts} 
            />
            <StatCard 
              icon={<Eye className="text-neutral-100 size-5" />} 
              label="Total Impressions" 
              value={userData.totalImpressions.toLocaleString()} 
            />
            <StatCard 
              icon={<Heart className="text-neutral-100 size-5" />} 
              label="Total Reactions" 
              value={userData.totalReactions.toLocaleString()} 
            />
            <StatCard 
              icon={<UserPlus className="text-neutral-100 size-5" />} 
              label="Profile Value" 
              value={userData.totalProfileValue} 
            />
            <StatCard 
              icon={<Bookmark className="text-neutral-100 size-5" />} 
              label="Total Follows" 
              value={userData.totalFollows} 
            />
            
              <StatCard 
                icon={<BarChart2 className="text-neutral-100 size-5" />} 
                label="Total Engagements" 
                value={userData.totalEngagements.toLocaleString()} 
              />
        
          </div>

          {/* Chart Section - Added fixed height container */}
          <div className="bg-neutral-800 p-4 sm:p-6 rounded-lg">
            <div className="h-64 sm:h-80 md:h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Configurations Section - Hidden on mobile */}
      <div className="hidden bg-background lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

// Extracted StatCard as a separate component for cleaner code
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-neutral-800 p-3 sm:p-4 rounded-lg hover:bg-neutral-700 transition-colors">
    <div className="flex items-center gap-2 mb-1 sm:mb-2">
      {icon}
      <span className="text-neutral-100 text-xs sm:text-sm">{label}</span>
    </div>
    <p className="text-xl sm:text-2xl font-bold">{value}</p>
  </div>
);

export default UserAnalytics;