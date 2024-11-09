using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pingmeAPI.Models;
using pingmeAPI.Services;

namespace pingmeAPI.Controllers
{
    // [Authorize]
    public class UsersController : BaseController
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUserbyId(id);
            return Ok(user);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            // Find the user by ID
            var isDeleted = await _userService.DeleteUserAsync(id);

            if (!isDeleted)
            {
                // User not found
                return NotFound(new { message = "User not found." });
            }

            // Return success response
            return Ok(new { message = "User deleted successfully." });
        }
    }
}