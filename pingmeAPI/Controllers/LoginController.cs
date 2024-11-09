using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using pingmeAPI.Models;
using pingmeAPI.Services;

namespace pingmeAPI.Controllers
{
    public class LoginController : BaseController
    {
        private readonly UserService _userService;
        public LoginController(UserService userService)
        {
            _userService = userService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var token = await _userService.Authenticate(login.Username, login.Password);
            var user = await _userService.GetUserbyUserNamePassword(login.Username, login.Password);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
           return Ok(new {token= token, Id = user.Id ,ConnectionId=user.ConnectionId,Username=user.Username});
        }
    }
}