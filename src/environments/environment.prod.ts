export const environment = {
  production: true,
  apiUrl: 'https://fab8-2803-f340-1205-1602-b574-2aa4-97cb-e4fb.ngrok-free.app',
  timeoutMs: 30000,
  endpoints: {
    usuarios: {
      auth: {
        autenticar: '/Usuarios/api/Auth/Autenticar',
        olvidarContrasena: '/Usuarios/api/Auth/OlvidarContrasena',
      },
      usuario: {
        obtenerTodos: '/Usuarios/api/Usuario/ObtenerTodosLosUsuarios',
        obtenerPorId: '/Usuarios/api/Usuario/ObtenerUsuarioPorId',
        obtenerPorIdentificacion: '/Usuarios/api/Usuario/ObtenerUsuarioPorIdentificacion',
        agregar: '/Usuarios/api/Usuario/AgregarUsuario',
        actualizar: '/Usuarios/api/Usuario/ActualizarUsuario',
        actualizarContrasena: '/Usuarios/api/Usuario/ActualizarContrasena',
        eliminar: '/Usuarios/api/Usuario/EliminarUsuario',
      },
      rol: {
        obtenerTodos: '/Usuarios/api/Rol/ObtenerTodosLosRoles',
        obtenerPorId: '/Usuarios/api/Rol/ObtenerRolPorId',
      },
      tipoCedula: {
        obtenerTodos: '/Usuarios/api/TipoCedula/ObtenerTodosLosTiposCedula',
        obtenerPorId: '/Usuarios/api/TipoCedula/ObtenerTipoCedulaPorId',
      },
      departamento: {
        obtenerTodos: '/Usuarios/api/Departamento/ObtenerTodosLosDepartamentos',
        obtenerPorId: '/Usuarios/api/Departamento/ObtenerDepartamentoPorId',
      },
      usuarioRol: {
        obtenerPorUsuario: '/Usuarios/api/UsuarioRol/ObtenerRolPorUsuario',
        actualizar: '/Usuarios/api/UsuarioRol/ActualizarUsuarioRol',
        eliminar: '/Usuarios/api/UsuarioRol/EliminarUsuarioRol',
      },
      departamentoUsuario: {
        agregar: '/Usuarios/api/DepartamentoUsuario/AgregarDepartamentoUsuario',
        obtenerPorUsuario: '/Usuarios/api/DepartamentoUsuario/ObtenerDepartamentoPorUsuario',
        eliminar: '/Usuarios/api/DepartamentoUsuario/EliminarDepartamentoUsuario',
      },
    },
    parametros: {
      mensaje: {
        obtenerPorPantalla: '/Parametros/api/Mensaje/ObtenerMensajesPorPantalla',
      },
      menu: {
        obtenerPorPerfil: '/Parametros/api/Menu/ObtenerMenusPorPerfil',
      },
      parametro: {
        obtenerPorNombre:  '/Parametros/api/Parametro/ObtenerParametroPorNombre',
        obtenerPorNombres: '/Parametros/api/Parametro/ObtenerParametrosPorNombres',
      },
    },
    reclamos: {
      reclamo: {
        agregar: '/Reclamos/api/Reclamo/AgregarReclamo',
        obtenerPorUsuario: '/Reclamos/api/Reclamo/ObtenerReclamoPorUsuario',
        obtenerPorUsuarioOrdenado: '/Reclamos/api/Reclamo/ObtenerReclamoPorUsuarioOrdenado',
        obtenerPorDepartamento: '/Reclamos/api/Reclamo/ObtenerReclamoPorDepartamento',
        obtenerPorFechaEstado: '/Reclamos/api/Reclamo/ObtenerReclamoPorFechaEstado',
      },
      detalleReclamo: {
        obtener:                    '/Reclamos/api/DetalleReclamo/ObtenerDetalleReclamo',
        obtenerPorId:               '/Reclamos/api/DetalleReclamo/ObtenerDetalleReclamoPorIdDetalle',
        obtenerPorDepartamentoEstado: '/Reclamos/api/DetalleReclamo/ObtenerDetalleReclamoPorIdDepartamentoYIdEstadoDetalle',
        editar:                     '/Reclamos/api/DetalleReclamo/EditarDetalleReclamo',
        historico:                  '/Reclamos/api/DetalleReclamoHistorico/ObtenerDetalleReclamoHistorico',
      },
      documentoInterno: {
        agregar:              '/Reclamos/api/DocumentoInterno/AgregarDocumentoInterno',
        obtenerPorReclamo:    '/Reclamos/api/DocumentoInterno/ObtenerDocumentoInternoPorReclamo',
        obtenerPorIdReclamo:  '/Reclamos/api/DocumentoInterno/ObtenerDocumentoInternoPorIdReclamo',
        eliminar:             '/Reclamos/api/DocumentoInterno/EliminarDocumentoInterno',
        historico:            '/Reclamos/api/DocumentoInternoHistorico/ObtenerDocumentoInternoPorDetalleReclamo',
      },
      documentoUsuario: {
        obtener: '/Reclamos/api/DocumentoUsuario',
        historico: '/Reclamos/api/DocumentoUsuarioHistorico',
      },
      estadoDetalle: {
        obtenerTodos: '/Reclamos/api/EstadoDetalle/ObtenerEstadosDetalleReclamo',
      },
      ordenNivel: {
        obtenerTodos: '/Reclamos/api/OrdenNivel/ObtenerOrdenNiveles',
      },
    },
    envioCorreos: {
      correo: {
        agregar: '/EnvioCorreos/api/Correo/AgregarCorreo',
      },
    },
  },
};
