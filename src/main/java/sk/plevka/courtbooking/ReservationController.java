package sk.plevka.courtbooking;

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
    public Reservation addReservation(@RequestBody Reservation reservation, Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        reservation.setUser(user);

        boolean conflict = reservationRepository.existsByCourtAndStartTime(
                reservation.getCourt(), reservation.getStartTime()
                );
                if(conflict){
                  throw new ResponseStatusException(HttpStatus.CONFLICT, "Court is occupied");
                }
                Reservation saved = reservationRepository.save(reservation);
                messagingTemplate.convertAndSend("/topic/reservations", saved);
                return saved;
    }

    @DeleteMapping("/reservations/{id}")
    public void delReservation(@PathVariable Long id){
        LocalDateTime now = LocalDateTime.now();
        Reservation r = reservationRepository.findById(id).orElseThrow();

        if(r.getStartTime().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already started");
        }

        reservationRepository.deleteById(id);
    }
}
