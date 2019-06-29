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

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(IUserService userService, IMapper mapper, IOptions<AppSettings> appSettings, DataContext context)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;

            //var exists = _context.Users.Where(x => x.Username == "cristinacoxinho") != null;
            //if(exists)
                //return;
            string password = "123456";
            byte[] passwordHash, passwordSalt;
            UserService.CreatePasswordHash(password, out passwordHash, out passwordSalt);
            _context.Users.Add(new User {
                    FirstName = "Cristina",
                    LastName = "Coxinho",
                    Username = "cristinacoxinho",
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    Admin = true
            });
            _context.SaveChanges();
        }

        // POST: /users/authenticate
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserDto userDto)
        {
            var user = _userService.Authenticate(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Id.ToString())
            };

            if (user.Admin) {
                claims.Add(new Claim("Admin", "true"));
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("thisisaverylongandawesomepassword" /*_appSettings.Secret*/);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
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
        public IActionResult Register([FromBody]UserDto userDto)
        {
            // map dto to entity
            var user = _mapper.Map<User>(userDto);

            try 
            {
                // save 
                _userService.Create(user, userDto.Password);
                return Ok();
            } 
            catch(AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: /users
        [HttpGet]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult GetAll()
        {
            var users =  _userService.GetAll();
            var userDtos = _mapper.Map<IList<UserDto>>(users);
            return Ok(userDtos);
        }

        // GET: /users/{id}
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult GetById(int id)
        {
            var user =  _userService.GetById(id);
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        // PUT: /users/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]UserDto userDto)
        {
            if(!isCurrentUserOrAdmin(id))
                return BadRequest(new { message = "Forbidden"});

            // map dto to entity and set id
            var user = _mapper.Map<User>(userDto);
            user.Id = id;

            try 
            {
                // save 
                _userService.Update(user, userDto.Password);
                return Ok();
            } 
            catch(AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        // DEL: /users/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
             if(!isCurrentUserOrAdmin(id))
                return BadRequest(new { message = "Forbidden"});

            _userService.Delete(id);
            return Ok();
        }
        
        private bool isCurrentUserOrAdmin(int id) {
            bool isAdmin = User.Claims.Where(x => x.Type.Equals("Admin") && x.Value.Equals("true")).FirstOrDefault() != null;
            bool isCurrentUser = User.Identity.Name == id.ToString();
            return isAdmin || isCurrentUser;
        }
    }
}
