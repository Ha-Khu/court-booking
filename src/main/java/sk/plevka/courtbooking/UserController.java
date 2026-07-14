package sk.plevka.courtbooking;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User addUser(@RequestBody User user){
        boolean conflict = userRepository.existsByEmail(
                user.getEmail()
        );
        if(conflict){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginData){
        User user = userRepository.findByEmail(loginData.getEmail()).orElseThrow();

        boolean result = passwordEncoder.matches(loginData.getPassword(), user.getPassword());

        if(!result){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail());

    }

}
