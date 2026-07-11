package sk.plevka.courtbooking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ReservationRepository extends JpaRepository <Reservation, Long> {
    boolean existsByCourtAndStartTime(Court court, LocalDateTime startTime);
}
