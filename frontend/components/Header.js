
import ProfileButton from './ProfileButton';




const Header = () => {
  return (
    <header className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
      <ProfileButton />
    </header>
  );
};

export default Header;
