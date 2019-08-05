using System;
using System.Collections.Generic;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using AutoMapper;
using Server.Helpers;
using Server.Services;
using Server.Dtos;
using Server.Models;

namespace Server.Controllers {
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase {
        private IUserService _userService;
        private IMapper _mapper;
        private IConfiguration _config;

        public UsersController(IUserService userService, IMapper mapper, IConfiguration config) {
            _userService = userService;
            _mapper = mapper;
            _config = config;
        }

        // POST: /users/register
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto) {
            var user = _mapper.Map<User>(userDto); // Map Dto to the User class

            try {
                _userService.Register(user, userDto.password);
                return Ok();
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: /users/login
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody]UserDto userDto) {
            // Autenticar um utilizador na base de dados
            var user = _userService.Login(userDto.username, userDto.password);

            if (user == null) // Se não estiver encontrado um utilizador, envia-se essa mensagem para o cliente.
                return BadRequest(new { message = "Username or password is incorrect" });

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.id) };

            if (user.admin) // Se o utilizador for Admin, vou adicionar essa Claim à lista de Claims
                claims.Add(new Claim("Admin", "true"));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("Authentication").GetSection("Secret").Value);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims), // Associar a lista de Claims ao JSON Web Token
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return informações básicas do usuário (sem password) e token para armazenar o lado do cliente
            return Ok(new {
                Id = user.id,
                Username = user.username,
                FirstName = user.firstName,
                LastName = user.lastName,
                Admin = user.admin,
                Token = tokenString
            });
        }

        // GET: /users
        [HttpGet]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult GetAll() {
            var users =  _userService.GetAll(); // Obter todos os utilizadores
            var userDtos = _mapper.Map<IList<UserDto>>(users); // Mapear utilizadores com o respectivo data object
            return Ok(userDtos); // Enviar utilizadores para o cliente
        }

        // GET: /users/{id}
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult GetById(string id) {
            var user =  _userService.GetById(id); // Obter utilizador por id
            var userDto = _mapper.Map<UserDto>(user); // Mapear utilizador ao seu Data Object
            return Ok(userDto); // Enviar para o cliente
        }

        // PUT: /users/{id}
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody]UserDto userDto) {
            if(!isCurrentUserOrAdmin(id)) // Se não for o próprio utilizador ou um Admin
                return BadRequest(new { message = "Forbidden"}); // Enviar 'forbidden'

            var user = _mapper.Map<User>(userDto); // Mapear data object ao utilizador e colocar o seu id
            user.id = id;

            try { 
                _userService.Update(user, userDto.password); // Actualizar utilizador
                return Ok(); // Enviar 'OK' para o cliente
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message }); // Retorna mensagem de erro se houver uma excepção
            }
        }

        // DEL: /users/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id) {
            if(!isCurrentUserOrAdmin(id)) // Se não for o próprio utilizador ou um Admin
                return BadRequest(new { message = "Forbidden"}); // Enviar 'forbidden'

            _userService.Delete(id); // Apagar utilizador por id
            return Ok();
        }
        
        private bool isCurrentUserOrAdmin(string id) {
            // isAdmin é verdadeiro se o utilizador actual for Administrador
            bool isAdmin = User.Claims.Where(x => x.Type.Equals("Admin") && x.Value.Equals("true")).FirstOrDefault() != null;
            // isCurrentUser é verdadeiro se o utilizador actual tiver o id que vem no argumento
            bool isCurrentUser = User.Identity.Name == id;
            return isAdmin || isCurrentUser;
        }
    }
}
