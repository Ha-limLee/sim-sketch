package com.simsketch.backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController()
@RequiredArgsConstructor
@RequestMapping("${api-prefix}/user")
public class UserController {
  private final UserService userService;

  @PostMapping("/signup")
  public ResponseEntity<String> signup(@RequestBody UserDto.Signup signupDto) {
    userService.signup(signupDto.getEmail(), signupDto.getPassword(),
        signupDto.getRole(), signupDto.getName());
    return new ResponseEntity<>("ok", HttpStatus.OK);
  }
}
