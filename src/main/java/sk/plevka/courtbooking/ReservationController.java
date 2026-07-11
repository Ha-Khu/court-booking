package sk.plevka.courtbooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReservationController {
    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository){
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/reservations")
    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    @PostMapping("/reservations")
    public Reservation addReservation(@RequestBody Reservation reservation){
        return reservationRepository.save(reservation);
    }
}
