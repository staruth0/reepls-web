import BlogComponent from '../../components/molecules/BlogComponent';
import './feed.scss';
const UserFeed = () => {
  return (
    <div className="grid">
      <div className="Feed__Posts">
        <BlogComponent />
      </div>
      <div className="communique"></div>
    </div>
  );
};

export default UserFeed;
