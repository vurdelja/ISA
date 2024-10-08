using Medicina.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Medicina.DTO;
using Medicina.Context;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace Medicina.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowOrigin")]
    public class AuthController : ControllerBase
    {
        //private readonly IUserService userService;
        private readonly IConfiguration _config;
        public readonly PersonContext _personContext;
        public readonly UserContext _userContext;

        public AuthController(PersonContext personContext, UserContext userContext, IConfiguration projectConfig)
        {
            _personContext = personContext;
            _userContext = userContext;
            _config = projectConfig;

        }



        [Route("login")]
        [HttpPost]
        public IActionResult Login(LoginDTO loginDTO)
        {
            if (loginDTO == null || loginDTO.Email == null || loginDTO.Password == null)
            {
                return BadRequest("Invalid client request");
            }

            // Retrieve the person from the database
            Person person = _personContext.GetUserWithEmailAndPassword(loginDTO.Email, loginDTO.Password);
            if (person == null || loginDTO.Password != person.Password)
            {
                return BadRequest("Invalid credentials!");
            }

            if (!person.IsActivated)
            {
                return BadRequest("Account not activated!");
            }

            // Retrieve the corresponding user from the Users table
            User user = _userContext.Users.FirstOrDefault(u => u.Email == person.Email);
            if (user == null)
            {
                return BadRequest("User not found in Users table!");
            }

            // Log the retrieved user details
            Console.WriteLine($"Retrieved User - ID: {user.UserID}, Email: {user.Email}");

            Claim[] claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, "hkz2Ba9cf2Q4lPjAf6mS"),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
        new Claim("Id", user.UserID.ToString()), // Use UserID from Users table
        new Claim("Email", user.Email)
    };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("zxzxzxzxzxrltCPJ9e6jzxczckCq5nrPP5A"));
            SigningCredentials signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken token = new JwtSecurityToken("bOH8NLMXtivXMrB6c9ED", "wEoprCagCl0G5ySSfZxA", claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: signIn);
            string accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            TokenDTO tokenDTO = new TokenDTO() { Token = accessToken };
            return Ok(tokenDTO);
        }

    }
}