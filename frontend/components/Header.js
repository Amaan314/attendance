
import ProfileButton from './ProfileButton';

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
      <ProfileButton />
    </header>
  );
};

export default Header;
