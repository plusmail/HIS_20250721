package kroryi.his.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "persistent_logins")
public class PersistentLogin {

    @Id
    @Column(name = "series", length = 64)
    private String series; // Unique identifier for the login

    @Column(name = "username", length = 64, nullable = false)
    private String username; // The username of the user

    @Column(name = "token", length = 64, nullable = false)
    private String token; // The token associated with the login

    @Column(name = "last_used", nullable = false)
    private LocalDateTime lastUsed; // Last used timestamp

    // Getters and Setters

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getLastUsed() {
        return lastUsed;
    }

    public void setLastUsed(LocalDateTime lastUsed) {
        this.lastUsed = lastUsed;
    }
}