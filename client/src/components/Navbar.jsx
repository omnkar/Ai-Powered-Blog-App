import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token } = useAppContext();
  
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img 
        onClick={() => navigate("/")} 
        src={assets.logo} 
        alt="logo" 
        className="w-32 sm:w-44 cursor-pointer" 
      />
      {token ? (
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
        >
          Dashboard
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      ) : (
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer border border-primary text-primary px-10 py-2.5 hover:bg-primary hover:text-white transition-all duration-300"
          >
            Login
            <img src={assets.arrow} alt="arrow" className="w-3 " />
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer border border-primary text-primary px-10 py-2.5 hover:bg-primary hover:text-white transition-all duration-300"
          >
            Signup
            <img src={assets.arrow} alt="arrow" className="w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;