package com.simsketch.backend.user;

import org.springframework.stereotype.Service;

import com.simsketch.backend.user.exception.UserDuplicatedEmailException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
  private final UserRepository userRepository;

  public Long signup(String email, String password, UserRole role,
      String name) {
    userRepository.findByEmail(email).ifPresent((__) -> {
      throw new UserDuplicatedEmailException(name);
    });
    UserEntity member = UserEntity.builder().email(email).password(password)
        .role(role).name(name).build();
    userRepository.save(member);
    return member.getId();
  }
}
