package sk.plevka.courtbooking;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class ReservationController {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ReservationController(ReservationRepository reservationRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate){
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/reservations")
    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> addReservation(@RequestBody Reservation reservation, Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        reservation.setUser(user);

        boolean conflict = reservationRepository.existsByCourtAndStartTime(
                reservation.getCourt(), reservation.getStartTime()
                );
                if(conflict){
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Court is occupied");
                }
                Reservation saved = reservationRepository.save(reservation);
                messagingTemplate.convertAndSend("/topic/reservations", saved);
                return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<?> delReservation(@PathVariable Long id, Authentication auth){
        LocalDateTime now = LocalDateTime.now();
        Reservation r = reservationRepository.findById(id).orElseThrow();
        String email = auth.getName();
        String ownerEmail = r.getUser().getEmail();

        if(!email.equals(ownerEmail)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your reservation");
        }

        if(r.getStartTime().isBefore(now)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already started");
        }

        reservationRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/reservations", "deleted");
        return ResponseEntity.ok().build();
    }
}
