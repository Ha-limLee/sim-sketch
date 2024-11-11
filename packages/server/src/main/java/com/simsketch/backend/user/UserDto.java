package com.simsketch.backend.user;

import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDto {
  @Data
  @NoArgsConstructor
  public static class Signup {
    public String email;
    public String password;
    public String name;
    public UserRole role = UserRole.MEMBER;
  }
}
