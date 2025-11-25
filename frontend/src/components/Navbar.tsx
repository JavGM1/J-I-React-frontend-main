import { useEffect } from "react";
import { useState } from "react";
import type React from "react";
import { registerUser, loginUser, fetchUserInfo } from '../api';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import SearchBar from "./SearchBar";
import { Facebook, Instagram } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { Person, Cart } from "react-bootstrap-icons";
import type { CartItem } from "../hooks/useCart";




type NavbarProps = {
  setCategory?: (cat: string) => void;
  // Carrito
  itemCount?: number;
  cart?: CartItem[];
  increaseQuantity?: (id: number) => void;
  decreaseQuantity?: (id: number) => void;
  removeFromCart?: (id: number) => void;
  clearCart?: () => void;
  cartTotal?: number;
};

export default function AppNavbar({ setCategory, itemCount = 0, cart = [], increaseQuantity, decreaseQuantity, removeFromCart, clearCart, cartTotal = 0 }: NavbarProps) {
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    useEffect(() => {
      if (showAdminPanel) {
        setLoadingUsers(true);
        setErrorUsers(null);
        fetch("/api/v2/user/get")
          .then(res => {
            if (!res.ok) throw new Error("Error al obtener usuarios");
            return res.json();
          })
          .then(data => {
            let users = [];
            if (data._embedded && data._embedded.usuarioList) {
              users = data._embedded.usuarioList;
            } else if (Array.isArray(data)) {
              users = data;
            } else if (typeof data === 'object' && data !== null && data.id_usuario) {
              users = [data]; // Un solo usuario como objeto
            }
            setAdminUsers(users);
          })
          .catch(() => setErrorUsers("No se pudo cargar la lista de usuarios."))
          .finally(() => setLoadingUsers(false));
      }
    }, [showAdminPanel]);

    async function handleDeleteUser(userId: number) {
      if (!userData) return;
      if (!window.confirm("¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;
      setDeletingUserId(userId);
      try {
        // Usar los datos del admin logueado
        const adminBody = {
          email: userData.email,
          password: userData.password
        };
        const res = await fetch(`/api/v2/user/del?id=${userId}&id_admin=${userData.id_usuario}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminBody)
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "No se pudo eliminar el usuario");
        }
        setAdminUsers(users => users.filter(u => u.id_usuario !== userId));
      } catch (err: any) {
        alert("Error al eliminar usuario: " + (err?.message || ""));
      } finally {
        setDeletingUserId(null);
      }
    }
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  async function handleDeleteAccount() {
    setDeleteError(null);
    setDeleteSuccess(null);
    setDeletingAccount(true);
    try {
      const user = userData;
      const res = await fetch(`/api/v2/user/delself?id=${user.id_usuario}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          id_usuario: user.id_usuario
        })
      });
      if (res.ok) {
        setDeleteSuccess('Cuenta eliminada correctamente.');
        setTimeout(() => {
          setShowAccount(false);
          handleLogout();
        }, 1500);
      } else {
        setDeleteError('No se pudo eliminar la cuenta.');
      }
    } catch (err) {
      setDeleteError('Error de red o servidor.');
    } finally {
      setDeletingAccount(false);
    }
  }
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const [userName, setUserName] = useState<string | null>(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.nombre || null;
      }
    } catch { }
    return null;
  });
  const [userData, setUserData] = useState<any | null>(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) return JSON.parse(user);
    } catch { }
    return null;
  });
  const [showAccount, setShowAccount] = useState(false);

  function handleLogout() {
    localStorage.removeItem("user");
    setUserName(null);
    setUserData(null);
    window.location.href = "/";
  }

  const [registerNombre, setRegisterNombre] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerDireccion, setRegisterDireccion] = useState("");
  const [registerTelefono, setRegisterTelefono] = useState("");
  const [registerOver18, setRegisterOver18] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  function validateEmail(email: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginSuccess(null);
    setLoginError("");
    if (!validateEmail(loginEmail)) {
      setLoginError("Email inválido");
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    let ok = false;
    try {
      ok = await loginUser(loginEmail, loginPassword);
    } catch (err) {
      setLoginError("Contraseña errónea");
      setLoginSuccess(null);
      return;
    }
    if (!ok) {
      setLoginError("Contraseña errónea");
      setLoginSuccess(null);
      return;
    }
    try {
      const userInfo = await fetchUserInfo(loginEmail, loginPassword);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUserName(userInfo.nombre || null);
      setUserData(userInfo);
      setLoginError("");
      setLoginSuccess("¡Inicio de sesión exitoso!");
      setTimeout(() => {
        setShowLogin(false);
        setLoginSuccess(null);
        setLoginEmail("");
        setLoginPassword("");
      }, 1500);
    } catch (err) {
      setLoginError("Contraseña errónea");
      setLoginSuccess(null);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegisterSuccess(null);
    if (!registerNombre.trim()) {
      setRegisterError("El nombre es obligatorio");
      return;
    }
    if (!validateEmail(registerEmail)) {
      setRegisterError("Email inválido");
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!registerDireccion.trim()) {
      setRegisterError("La dirección es obligatoria");
      return;
    }
    if (!registerTelefono.trim()) {
      setRegisterError("El teléfono es obligatorio");
      return;
    }
    if (!/^[0-9]+$/.test(registerTelefono)) {
      setRegisterError("El teléfono solo debe contener números");
      return;
    }
    if (registerTelefono.length < 9) {
      setRegisterError("El teléfono debe tener al menos 9 dígitos");
      return;
    }
    if (!registerOver18) {
      setRegisterError("Debes confirmar que eres mayor de 18 años");
      return;
    }
    try {
      await registerUser({
        nombre: registerNombre,
        email: registerEmail,
        password: registerPassword,
        direccion: registerDireccion,
        telefono: registerTelefono,
      });
      setRegisterError("");
      setRegisterSuccess("¡Registro exitoso!");
      setRegisterNombre("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterDireccion("");
      setRegisterTelefono("");
      setRegisterOver18(false);
    } catch (err) {
      setRegisterError("Error al registrar usuario");
      setRegisterSuccess(null);
    }
  }

  function handleGoHome(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = '/';
  }

  const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#" onClick={handleGoHome}>J&I Muebles</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="navbar-flex w-100 d-flex align-items-center">
            <Nav className="navbar-nav-left">
              <Nav.Link href="#" onClick={handleGoHome}>Inicio</Nav.Link>
              <Nav.Link href="#catalogo">Catálogo</Nav.Link>
              <NavDropdown title="Muebles" id="basic-nav-dropdown">
                <NavDropdown.Item href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setCategory && setCategory('living'); }}>
                  Living
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setCategory && setCategory('oficina'); }}>
                  Oficina
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setCategory && setCategory('baño'); }}>
                  Baño
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setCategory && setCategory('todos'); }}>
                  Catálogo completo
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#contacto" onClick={(e) => { e.preventDefault(); setShowContact(true); }}>
                ¡Contáctanos!
              </Nav.Link>
            </Nav>
            <div className="navbar-search mx-auto">
              <SearchBar onSearch={(q: string) => window.dispatchEvent(new CustomEvent('app:search', { detail: q }))} />
            </div>
            <div className="navbar-icons d-flex align-items-center ms-auto">
              {userName && (
                <span className="navbar-user-greeting">¡Hola, {userName}! 😎</span>
              )}
              {userData && (userData.rol === 0 || userData.rol === "0" || userData.rol === "Super Admin") && (
                <Button className="me-2 btn-admin-panel" onClick={() => setShowAdminPanel(true)}>
                  Panel de Admin
                </Button>
              )}
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="loginDropdown" className="btn-person">
                  <Person size={22} className="icon-person" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {userName ? (
                    <>
                      <Dropdown.Item href="#" onClick={e => { e.preventDefault(); setShowAccount(true); }}>
                        Mi cuenta
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        Cerrar sesión
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                        Iniciar sesión
                      </Dropdown.Item>
                      <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>
                        Registrar
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        Mi cuenta
                      </Dropdown.Item>
                    </>
                  )}
                  <Modal show={showAdminPanel} onHide={() => setShowAdminPanel(false)} centered size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>Panel de Admin</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {loadingUsers ? (
                        <div>Cargando usuarios...</div>
                      ) : errorUsers ? (
                        <div className="text-danger">{errorUsers}</div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminUsers.map((u) => (
                                <tr key={u.id_usuario}>
                                  <td>{u.id_usuario}</td>
                                  <td>{u.nombre}</td>
                                  <td>{u.email}</td>
                                  <td>{u.rol === 0 ? "Super Admin" : u.rol === 3 ? "Cliente" : u.rol === 2 ? "Admin" : u.rol}</td>
                                  <td>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="ms-1"
                                      disabled={deletingUserId === u.id_usuario}
                                      onClick={() => handleDeleteUser(u.id_usuario)}
                                    >
                                      {deletingUserId === u.id_usuario ? "Eliminando..." : "Eliminar"}
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Modal.Body>
                  </Modal>
                  <Modal show={showAccount} onHide={() => setShowAccount(false)} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Mi cuenta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {userData ? (
                        <div>
                          <p><strong>Nombre:</strong> {userData.nombre}</p>
                          <p><strong>Email:</strong> {userData.email}</p>
                          {typeof userData.rol !== 'undefined' && (
                            <p><strong>Rol:</strong> {userData.rol === 0 ? 'Super Admin' : userData.rol === 3 ? 'Cliente' : userData.rol === 2 ? 'Admin' : userData.rol}</p>
                          )}
                          {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
                          {deleteSuccess && <div className="text-success mt-2">{deleteSuccess}</div>}
                          <div className="mt-4">
                            <Button variant="danger" onClick={() => {
                              if (window.confirm('¿Estás seguro de querer eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                handleDeleteAccount();
                              }
                            }} disabled={deletingAccount}>
                              {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p>No hay datos de usuario.</p>
                      )}
                    </Modal.Body>
                  </Modal>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-secondary" className="btn-cart position-relative ms-2" onClick={() => setShowCart(true)}>
                <Cart size={22} className="icon-cart" />
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                    <span className="visually-hidden">items en carrito</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="d-lg-none my-2">
            <SearchBar onSearch={(q: string) => window.dispatchEvent(new CustomEvent('app:search', { detail: q }))} className="w-100" />
          </div>
          <div className="navbar-mobile-icons d-lg-none d-flex justify-content-end gap-2 my-2">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="loginDropdownMobile" className="btn-person">
                <Person size={22} className="icon-person" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                  Iniciar sesión
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>
                  Registrar
                </Dropdown.Item>
                <Dropdown.Item href="#">
                  Mi cuenta
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="outline-secondary" className="btn-cart position-relative" onClick={() => setShowCart(true)}>
              <Cart size={22} className="icon-cart" />
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {itemCount}
                  <span className="visually-hidden">items en carrito</span>
                </span>
              )}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>


      {/* Login modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Dirección de correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                isInvalid={!!loginError && loginError.includes("Email")}
              />
              <Form.Control.Feedback type="invalid">
                {loginError && loginError.includes("Email") ? loginError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                isInvalid={!!loginError && loginError.includes("contraseña")}
              />
              <Form.Control.Feedback type="invalid">
                {loginError && loginError.includes("contraseña") ? loginError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginRemember">
              <Form.Check type="checkbox" label="Recuérdame" />
            </Form.Group>
            <Button variant="primary" type="submit">Enviar</Button>
            {loginError && (
              <div className="mt-3 text-danger fw-bold">{loginError}</div>
            )}
            {loginSuccess && (
              <div className="mt-3 text-success fw-bold">{loginSuccess}</div>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Register modal */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="registerNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={registerNombre}
                onChange={e => setRegisterNombre(e.target.value)}
                isInvalid={!!registerError && registerError.includes("nombre")}
              />
              <Form.Control.Feedback type="invalid">
                {registerError && registerError.includes("nombre") ? registerError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Dirección de correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                isInvalid={!!registerError && registerError.includes("Email")}
              />
              <Form.Text id="registerEmailHelp" muted>
                Nunca compartiremos tu email con nadie más.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {registerError && registerError.includes("Email") ? registerError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                isInvalid={!!registerError && registerError.includes("contraseña")}
              />
              <Form.Control.Feedback type="invalid">
                {registerError && registerError.includes("contraseña") ? registerError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu dirección"
                value={registerDireccion}
                onChange={e => setRegisterDireccion(e.target.value)}
                isInvalid={!!registerError && registerError.includes("dirección")}
              />
              <Form.Control.Feedback type="invalid">
                {registerError && registerError.includes("dirección") ? registerError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu teléfono"
                value={registerTelefono}
                onChange={e => {
                  // Solo permitir números
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setRegisterTelefono(val);
                  }
                }}
                isInvalid={!!registerError && (registerError.includes("teléfono") || registerError.includes("números") || registerError.includes("dígitos"))}
                maxLength={15}
              />
              <Form.Control.Feedback type="invalid">
                {registerError && (registerError.includes("teléfono") || registerError.includes("números") || registerError.includes("dígitos")) ? registerError : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerOver18">
              <Form.Check
                type="checkbox"
                label="Confirmo que soy mayor de 18 años"
                checked={registerOver18}
                onChange={e => setRegisterOver18(e.target.checked)}
                isInvalid={!!registerError && registerError.includes("mayor de 18")}
              />
              {registerError && registerError.includes("mayor de 18") && (
                <div className="text-danger mt-1">{registerError}</div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">Enviar</Button>
            {registerSuccess && <div className="mt-3 text-success">{registerSuccess}</div>}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Contact modal */}
      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Dirección:</strong> Cumming 593, Valparaíso, Chile</p>
          <p><strong>Email:</strong> contacto@jimuebles.com</p>
          <p><strong>Teléfono:</strong> +56 9 5464 9483</p>
          <div className="text-center">
            <strong>Horario:</strong><br />
            Lunes a Viernes, 9:00 a 18:00<br />
            Sábado 12:00 a 15:00
            <div className="text-center mt-3">
              <a
                href="https://youtu.be/dQw4w9WgXcQ?si=pzFuDkJEoqfXC76o"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline-primary me-2"
              >
                <Facebook className="me-2" /> Facebook
              </a>
              <a
                href="https://youtu.be/dQw4w9WgXcQ?si=pzFuDkJEoqfXC76o"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline-danger"
              >
                <Instagram className="me-2" /> Instagram
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Cart modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mi carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <p className="text-center mb-0">Tu carrito está vacío.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <Button variant="outline-secondary" size="sm" onClick={() => decreaseQuantity && decreaseQuantity(it.id)}>-</Button>
                          <span className="px-3">{it.quantity}</span>
                          <Button variant="outline-secondary" size="sm" onClick={() => increaseQuantity && increaseQuantity(it.id)}>+</Button>
                        </div>
                      </td>
                      <td className="text-end">{clp.format(it.price)}</td>
                      <td className="text-end">{clp.format(it.price * it.quantity)}</td>
                      <td className="text-end">
                        <Button variant="outline-danger" size="sm" onClick={() => removeFromCart && removeFromCart(it.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">Total</td>
                    <td className="text-end fw-bold">{clp.format(cartTotal)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {cart.length > 0 && (
            <Button variant="outline-danger" onClick={() => clearCart && clearCart()}>Vaciar carrito</Button>
          )}
          <Button variant="secondary" onClick={() => setShowCart(false)}>Cerrar</Button>
          <Button variant="primary" disabled={cart.length === 0}>Ir a pagar</Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
}
