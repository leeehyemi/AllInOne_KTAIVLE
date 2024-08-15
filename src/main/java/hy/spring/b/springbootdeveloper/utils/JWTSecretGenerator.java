package hy.spring.b.springbootdeveloper.utils;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class JWTSecretGenerator {

    public static SecretKey generateJWTSecret() throws NoSuchAlgorithmException {
        // Create a secure key for HS512 algorithm
        return Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
    }

    public static void main(String[] args) {
        try {
            SecretKey secretKey = generateJWTSecret();
            byte[] secretBytes = secretKey.getEncoded();
            String secret = Base64.getUrlEncoder().encodeToString(secretBytes);

            System.out.println("Generated JWT Secret: " + secret);
        } catch (NoSuchAlgorithmException e) {
            System.err.println("Error generating JWT secret: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
