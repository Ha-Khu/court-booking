package sk.plevka.courtbooking;

import jakarta.persistence.*;

@Entity
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Enumerated(EnumType.STRING)
    private Sport sport;
    private boolean outdoor;

    public Long getId() {
        return id;
    }

    public Sport getSport() {
        return sport;
    }

    public boolean isOutdoor() {
        return outdoor;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public void setOutdoor(boolean outdoor) {
        this.outdoor = outdoor;
    }

    public Court(){

    }
}
