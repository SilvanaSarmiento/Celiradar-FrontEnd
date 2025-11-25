function abrirLogin() {
  Swal.fire({
    title: "Iniciar sesión",
    html: `
      <input type="email" id="email" class="swal2-input" placeholder="Email">
      <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    `,
    confirmButtonText: "Entrar",
  });
}

function abrirSuscribir() {
  Swal.fire({
    title: "Suscribite",
    html: `
      <input type="email" id="email" class="swal2-input" placeholder="Email">
      <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    `,
    confirmButtonText: "Registrarme",
  });
}

export default App;
