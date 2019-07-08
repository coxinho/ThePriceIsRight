using System;
using System.Collections.Generic;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using AutoMapper;
using Server.Helpers;
using Server.Services;
using Server.Dtos;
using Server.Entities;

namespace Server.Controllers {
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase {
        private IUserServiceMongo _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(IUserServiceMongo userService, IMapper mapper, IOptions<AppSettings> appSettings) {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        // POST: /users/authenticate
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserDto userDto) {
            // Vamos autênticar um utilizador na base de dados
            var user = _userService.Authenticate(userDto.Username, userDto.Password);

            if (user == null) // Se não tivermos encontrado um utilizador, enviar essa mensagem para o cliente.
                return BadRequest(new { message = "Username or password is incorrect" });

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Id) };

            if (user.Admin) // Se o utilizador for Admin, vamos adicionar essa Claim à lista de Claims
                claims.Add(new Claim("Admin", "true"));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("thisisaverylongandawesomepassword" /*_appSettings.Secret*/);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims), // Associamos a lista de Claims ao JSON Web Token
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info (without password) and token to store client side
            return Ok(new {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Admin = user.Admin,
                Token = tokenString
            });
        }

        // POST: /users/register
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto) {
            // Mapear data object à entidade user
            var user = _mapper.Map<User>(userDto);

            try {
                // Registar este utilizador
                _userService.Create(user, userDto.Password);
                return Ok();
            } catch(AppException ex) {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
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
            user.Id = id;

            try { 
                _userService.Update(user, userDto.Password); // Actualizar utilizador
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
