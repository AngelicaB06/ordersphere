import BottomNav from "../../components/client/BottomNav";

function Perfil() {

  // ==========================
  // NAVEGACIÓN
  // ==========================

  const navigate = useNavigate();

  // ==========================
  // DATOS DEL USUARIO
  // ==========================

  const nombre =
    localStorage.getItem("nombre") ||
    "Usuario";

  const correo =
    localStorage.getItem("correo") ||
    "Sin correo";

  const rol =
    localStorage.getItem("rol") ||
    "cliente";

  // ==========================
  // CERRAR SESIÓN
  // ==========================

  const cerrarSesion = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombre");
    localStorage.removeItem("correo");
    localStorage.removeItem("rol");

    navigate("/");

  };

  // Determinar si es admin
  const esAdmin = rol === "admin";

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 pb-28">

      {/* ==========================
          ENCABEZADO
      ========================== */}

      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl mb-8 transition-all hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <UserCircle size={48} strokeWidth={1.5} />
          <div>
            <h2 className="text-4xl font-bold">
              {esAdmin ? "Perfil Administrador" : "Mi Perfil"}
            </h2>
            <p className="mt-1 text-orange-100 text-lg opacity-90">
              Administra tu información personal
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ==========================
            INFORMACIÓN USUARIO (columna principal)
        ========================== */}

        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">

          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2">
            <User className="text-orange-500" size={24} />
            Información Personal
          </h3>

          {/* Avatar y nombre */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-5xl text-white font-bold shadow-lg ring-4 ring-orange-200 dark:ring-orange-800">
                {nombre.charAt(0).toUpperCase()}
              </div>
              {esAdmin && (
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1.5 shadow-lg">
                  <Shield size={18} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-2xl font-bold dark:text-white">{nombre}</h4>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {esAdmin ? (
                  <>
                    <Shield size={16} className="text-blue-500" />
                    Administrador
                  </>
                ) : (
                  <>
                    <BadgeCheck size={16} className="text-green-500" />
                    Cliente
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Campos de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                <User size={16} className="text-orange-500" />
                Nombre
              </label>
              <input
                value={nombre}
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-700 border-0 rounded-xl p-3 text-slate-800 dark:text-white font-medium cursor-default"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                <Mail size={16} className="text-orange-500" />
                Correo
              </label>
              <input
                value={correo}
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-700 border-0 rounded-xl p-3 text-slate-800 dark:text-white font-medium cursor-default"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                <Shield size={16} className="text-orange-500" />
                Rol
              </label>
              <input
                value={rol}
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-700 border-0 rounded-xl p-3 text-slate-800 dark:text-white font-medium cursor-default"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                <CircleDot size={16} className="text-green-500" />
                Estado
              </label>
              <input
                value="Online"
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-700 border-0 rounded-xl p-3 text-green-600 dark:text-green-400 font-medium cursor-default"
              />
            </div>
          </div>
        </div>

        {/* ==========================
            ACTIVIDAD Y ACCIONES (columna lateral)
        ========================== */}

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit">

          <h3 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-2">
            <Activity className="text-orange-500" size={24} />
            Actividad
          </h3>

          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Shield size={16} />
                Rol del Sistema
              </p>
              <p className="text-xl font-bold text-orange-500 mt-1">
                {rol}
              </p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Mail size={16} />
                Correo registrado
              </p>
              <p className="text-slate-700 dark:text-slate-300 break-all mt-1 font-medium">
                {correo}
              </p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CircleDot size={16} />
                Estado
              </p>
              <p className="text-green-500 font-bold flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>

            {/* CERRAR SESIÓN */}
            <button
              onClick={cerrarSesion}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogOut size={22} />
              Cerrar Sesión
            </button>
          </div>
        </div>

      </div>

      {/* MENÚ INFERIOR SOLO CLIENTE */}
      {!esAdmin && (
        <BottomNav />
      )}

    </div>

  );
}

export default Perfil;