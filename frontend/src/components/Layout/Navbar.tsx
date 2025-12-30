import { Link } from "react-router-dom";

import homeIcon from "@/assets/home.svg"
import networkIcon from "@/assets/network.svg"
import profileIcon from "@/assets/profile.svg"
import loginIcon from "@/assets/login.svg"
import registerIcon from "@/assets/register.svg"
import useAuth from "@/hooks/useAuth";
import logoutIcon from "@/assets/logout.svg"
import LoadingPage from "@/pages/LoadingPage";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return LoadingPage();
  return (
    <header className="p-2 bg-white shadow-sm w-full">
      <div className="xl:mx-40">
        <nav aria-label="Main Navigation" className="flex justify-between">
          <ul>
            <li className="h-full">
              <Link to="/" className="flex flex-col justify-between items-center h-full">
                <div>
                  <img
                    alt="home-icon"
                    src={homeIcon}
                  />
                </div>
                <span>Home</span>
              </Link>
            </li>
          </ul>
          <ul className="flex space-x-6">
            <li className="h-full">
              <Link to="/users" className="flex flex-col justify-between items-center h-full">
                <div>
                  <img
                    alt="network-icon"
                    src={networkIcon}
                  />
                </div>
                <span>Network</span>
              </Link>
            </li>
            {/* Render Profile and Log Out if authenticated */}
            {isAuthenticated ? (
              <>
                <li className="h-full">
                  <Link to="/profile" className="flex flex-col justify-between items-center h-full">
                    <div>
                      <img
                        alt="profile-icon"
                        src={profileIcon}
                        width={20}
                      />
                    </div>
                    <span>Profile</span>
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/logout" className="flex flex-col justify-between items-center h-full">
                    <div>
                      <img
                        alt="logout-icon"
                        src={logoutIcon}
                        width={20}
                      />
                    </div>
                    <span>Log Out</span>
                  </Link>
                </li>
              </>
            ) : (
              // Render Login and Register if not authenticated
              <>
                <li>
                  <Link to="/login" className="flex flex-col justify-between items-center h-full">
                    <div>
                      <img
                        alt="login-icon"
                        src={loginIcon}
                        width={20}
                      />
                    </div>
                    <span>Log In</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="flex flex-col justify-between items-center h-full">
                    <div>
                      <img
                        alt="register-icon"
                        src={registerIcon}
                        width={20}
                      />
                    </div>
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
