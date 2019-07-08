using System;
using System.Globalization;

namespace Server.Helpers {
    // Classe de excepção costumizada para enviar excepções específicas da aplicação (por exemplo, validação)
    // que podem ser apanhadas e lidadas no cliente
    public class AppException : Exception {
        public AppException() : base() {}

        public AppException(string message) : base(message) { }

        public AppException(string message, params object[] args) : base(String.Format(CultureInfo.CurrentCulture, message, args)) { }
    }
}