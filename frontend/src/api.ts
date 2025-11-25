
// Archivo de configuración de la URL base de la API para el frontend
export const API_BASE = "http://3.94.172.177:8080/api/v2";

export async function registerUser({ nombre, email, password, direccion, telefono }: { nombre: string, email: string, password: string, direccion: string, telefono: string }) {
  const res = await fetch(`${API_BASE}/user/add?direccion=${encodeURIComponent(direccion)}&telefono=${encodeURIComponent(telefono)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password, rol: 3, activo: true }),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return await res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/user/loginDP360?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  if (!res.ok) throw new Error("Error al iniciar sesión");
  return await res.json(); // true o false
}

export async function fetchUserInfo(email: string, password: string) {
  const res = await fetch(`${API_BASE}/user/loginINFO?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  if (!res.ok) throw new Error("Error al obtener info de usuario");
  return await res.json(); // UsuarioDTO con campo "rol"
}