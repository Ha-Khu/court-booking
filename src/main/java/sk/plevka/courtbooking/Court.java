package sk.plevka.courtbooking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private String sport;
    private boolean outdoor;

    public Long getId() {
        return id;
    }

    public String getSport() {
        return sport;
    }

    public boolean isOutdoor() {
        return outdoor;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public void setOutdoor(boolean outdoor) {
        this.outdoor = outdoor;
    }

    public Court(){

    }
}
