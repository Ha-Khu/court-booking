package sk.plevka.courtbooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CourtController {
    private final CourtRepository courtRepository;

    public CourtController(CourtRepository courtRepository){
        this.courtRepository = courtRepository;
    }

    @GetMapping("/courts")
    public List<Court> getAllCourts(){
        return courtRepository.findAll();
    }

    @PostMapping("/courts")
        public Court addCourt(@RequestBody Court court){
            return courtRepository.save(court);
        }

    @DeleteMapping("/courts/{id}")
        public void delCourt(@PathVariable Long id){
        courtRepository.deleteById(id);
    }
}
