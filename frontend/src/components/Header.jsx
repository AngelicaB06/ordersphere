import { Bell, Moon, Sun, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Header() {

  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-4">

      <div className="flex items-center justify-end"> {/* Cambiamos a justify-end para alinear a la derecha */}

        {/* Acciones */}
        <div className="flex items-center gap-4">

          <button
            className="
              w-12
              h-12
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
              dark:text-white
              hover:bg-orange-100
              flex
              items-center
              justify-center
              transition
            "
          >
            <Bell size={20} />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              w-12
              h-12
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
              dark:text-white
              hover:bg-orange-100
              flex
              items-center
              justify-center
              transition
            "
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-orange-500
                flex
                items-center
                justify-center
                text-white
              "
            >
              <User size={20} />
            </div>

            <div>
              <p className="font-semibold dark:text-white">
                Administrador
              </p>

              <p className="text-sm text-green-500">
                ● Online
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;