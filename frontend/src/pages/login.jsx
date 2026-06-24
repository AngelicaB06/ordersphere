import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";

function Login() {

const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async () => {

  try {

    setError("");
    setLoading(true);

    const result = await loginUser(
      email,
      password
    );

    const rol = result.data.rol;

    localStorage.setItem(
      "rol",
      rol
    );

    localStorage.setItem(
      "nombre",
      result.data.nombre || "Usuario"
    );

    localStorage.setItem(
      "correo",
      result.data.Correo ||
      result.data.correo ||
      email
    );

    if (rol === "admin") {

      navigate("/dashboard");

    } else {

      navigate("/menu");

    }

  } catch (error) {

    console.error(error);

    setError(
      error.message ||
      "Correo o contraseña incorrectos"
    );

  } finally {

    setLoading(false);

  }

};

return ( <div className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center">


  {/* Glow naranja */}
  <div
    className="
      absolute
      w-[600px]
      h-[600px]
      bg-orange-500/30
      rounded-full
      blur-[180px]
      -left-32
      bottom-0
      animate-pulse
    "
  />

  {/* Glow morado */}
  <div
    className="
      absolute
      w-[600px]
      h-[600px]
      bg-purple-500/20
      rounded-full
      blur-[180px]
      right-0
      top-0
      animate-pulse
    "
  />

  {/* Glow azul */}
  <div
    className="
      absolute
      w-[400px]
      h-[400px]
      bg-cyan-500/20
      rounded-full
      blur-[180px]
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-1/2
    "
  />

  {/* Partículas */}
  <div className="absolute inset-0 overflow-hidden">

    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-orange-400 opacity-20 animate-pulse"
        style={{
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}

  </div>

  {/* Card */}
  <div
    className="
      relative
      z-10
      w-full
      max-w-md
      p-10
      rounded-[32px]
      backdrop-blur-xl
      bg-white/5
      border
      border-white/10
      shadow-2xl
      animate-[fadeIn_1s_ease]
    "
  >

    {/* Logo */}
    <div className="text-center mb-10">

      <div className="text-7xl mb-4 animate-bounce">
        🍔
      </div>

      <h1 className="text-6xl font-black text-white tracking-tight">
        Order
        <span className="text-orange-500">
          Sphere
        </span>
      </h1>

      <p className="text-slate-400 mt-4 text-lg">
        Gestión Inteligente de Restaurantes
      </p>

    </div>

    {/* Formulario */}
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >

      {/* Correo */}
      <div>

        <label className="text-slate-300 text-sm">
          Correo electrónico
        </label>

        <div className="relative mt-2">

          <Mail
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ordersphere.com"
            className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-orange-500
            "
          />

        </div>

      </div>

      {/* Contraseña */}
      <div>

        <label className="text-slate-300 text-sm">
          Contraseña
        </label>

        <div className="relative mt-2">

          <Lock
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-orange-500
            "
          />

        </div>

      </div>

      {/* Error */}
      {error && (
        <div
          className="
            p-3
            rounded-xl
            bg-red-500/10
            border
            border-red-500/20
            text-red-400
            text-center
          "
        >
          {error}
        </div>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-4
          rounded-2xl
          font-bold
          text-white
          bg-gradient-to-r
          from-orange-500
          to-orange-600
          hover:scale-[1.03]
          hover:shadow-[0_0_40px_rgba(249,115,22,0.8)]
          transition-all
          duration-300
          flex
          items-center
          justify-center
          gap-2
        "
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}

        <ArrowRight size={20} />
      </button>

    </form>

    {/* Registro */}
    <p className="text-center mt-8 text-slate-400">

      ¿No tienes cuenta?

      <span
        onClick={() => navigate("/register")}
        className="
          ml-2
          text-orange-400
          font-semibold
          cursor-pointer
          hover:text-orange-300
        "
      >
        Registrarse
      </span>

    </p>

  </div>

</div>
);
}

export default Login;