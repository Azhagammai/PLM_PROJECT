package com.partgenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PartGeneratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(PartGeneratorApplication.class, args);
        System.out.println("\n=====================================================");
        System.out.println("  Part Number Generator Backend is RUNNING!");
        System.out.println("  API available at: http://localhost:8080/api");
        System.out.println("  Health check:     http://localhost:8080/api/health");
        System.out.println("=====================================================\n");
    }
}
