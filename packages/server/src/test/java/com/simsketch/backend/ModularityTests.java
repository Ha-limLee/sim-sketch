package com.simsketch.backend;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

public class ModularityTests {
  ApplicationModules modules = ApplicationModules.of(SimsketchApplication.class);

  @Test
  void verifiesArchitecture() {
    modules.verify();
  }
}
