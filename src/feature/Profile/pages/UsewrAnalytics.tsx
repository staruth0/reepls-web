import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { Bookmark, MessageSquare, Heart, Eye, UserPlus, BarChart2 } from 'lucide-react';

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
import { useTranslation } from 'react-i18next';
import { useGetAuthorStatistics, useGetUserById } from '../hooks';


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
  const { id } = useParams<{ id: string }>(); 
  const { t } = useTranslation();
  const { statistics, isLoading, error } = useGetAuthorStatistics(id || ''); 
  const {user} = useGetUserById(id || '');

 
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
    maintainAspectRatio: false,
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1.66fr] min-h-screen">
        <div className="flex flex-col lg:border-r border-neutral-500">
          <Topbar>
            <p>{t("profile.userAnalytics")}</p>
          </Topbar>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-neutral-700" />
                <div className="text-center sm:text-left">
                  <div className="h-6 w-32 bg-neutral-700 mb-2 rounded" />
                  <div className="h-4 w-64 bg-neutral-700 mb-2 rounded" />
                  <div className="h-4 w-48 bg-neutral-700 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="bg-neutral-700 p-3 sm:p-4 rounded-lg h-24" />
                ))}
              </div>
              <div className="bg-neutral-700 p-4 sm:p-6 rounded-lg h-64 sm:h-80 md:h-96" />
            </div>
          </div>
        </div>
        <div className="hidden bg-background lg:block">
          <ProfileConfigurations />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1.66fr] min-h-screen">
        <div className="flex flex-col lg:border-r border-neutral-500">
          <Topbar>
            <p>{t("profile.userAnalytics")}</p>
          </Topbar>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-7xl mx-auto">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        </div>
        <div className="hidden bg-background lg:block">
          <ProfileConfigurations />
        </div>
      </div>
    );
  }

  // No statistics
  if (!statistics) {
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1.66fr] min-h-screen">
        <div className="flex flex-col lg:border-r border-neutral-500">
          <Topbar>
            <p>{t("profile.userAnalytics")}</p>
          </Topbar>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-7xl mx-auto">
            <p>No statistics available</p>
          </div>
        </div>
        <div className="hidden bg-background lg:block">
          <ProfileConfigurations />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1.66fr] min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col lg:border-r border-neutral-500">
        <Topbar>
          <p>{t("profile.userAnalytics")}</p>
        </Topbar>

        {/* Analytics content */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 w-full max-w-7xl mx-auto">
          {/* User Profile Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0">
                <img 
                  src={user?.profile_picture}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  {user?.name} 
                </h1>
                <p className="text-sm sm:text-base text-neutral-200 mb-2 sm:mb-4">
                 {user?.bio}
                </p>
                <div className="text-neutral-400 text-sm">
                  {t("profile.activeDate")}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard 
              icon={<Eye className="text-neutral-100 size-5" />} 
              label={t("profile.totalImpressions")} 
              value={statistics.impression_count.toLocaleString()} 
            />
            <StatCard 
              icon={<BarChart2 className="text-neutral-100 size-5" />} 
              label={t("profile.totalEngagements")} 
              value={statistics.engagement_count.toLocaleString()} 
            />
            <StatCard 
              icon={<Heart className="text-neutral-100 size-5" />} 
              label={t("profile.totalReactions")} 
              value={statistics.reaction_count.toLocaleString()} 
            />
            <StatCard 
              icon={<MessageSquare className="text-neutral-100 size-5" />} 
              label={t("profile.totalComments")} 
              value={statistics.comment_count.toLocaleString()} 
            />
            <StatCard 
              icon={<Bookmark className="text-neutral-100 size-5" />} 
              label={t("profile.totalShares")} 
              value={statistics.shares_count.toLocaleString()} 
            />
            <StatCard 
              icon={<UserPlus className="text-neutral-100 size-5" />} 
              label={t("profile.totalFollows")} 
              value={statistics.author_follower_count.toLocaleString()} 
            />
            <StatCard 
              icon={<BarChart2 className="text-neutral-100 size-5" />} 
              label={t("profile.profileViews")} 
              value={statistics.author_profile_views_count.toLocaleString()} 
            />
          </div>

          {/* Chart Section */}
          <div className="bg-neutral-800 p-4 sm:p-6 rounded-lg">
            <div className="h-64 sm:h-80 md:h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="hidden bg-background lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

// StatCard component
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