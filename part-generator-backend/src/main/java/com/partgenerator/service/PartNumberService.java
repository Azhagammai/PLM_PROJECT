package com.partgenerator.service;

import com.partgenerator.model.PartCounter;
import com.partgenerator.repository.PartCounterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * PartNumberService
 *
 * Responsible for generating unique structured part numbers using the schema:
 *   [CATEGORY]-[SUBCATEGORY]-[MATERIAL]-[PLANT][YY]-[SERIAL]-[REVISION]
 *
 * Example:  MECH-BODY-AL-MX26-10042-A
 *
 * The serial counter is stored in PostgreSQL (part_counter table)
 * so it NEVER resets even if the server restarts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PartNumberService {

    private final PartCounterRepository counterRepository;

    @Value("${app.part.counter-start:10000}")
    private long counterStart;

    /**
     * Generates the next unique part number.
     * Uses a DB transaction to ensure two users can never get the same serial.
     */
    @Transactional
    public String generatePartNumber(String category,
                                     String subcategory,
                                     String material,
                                     String plant,
                                     String revision) {

        long serial = getNextSerial();
        String year = String.valueOf(LocalDateTime.now().getYear()).substring(2); // "26"

        String partNumber = String.format("%s-%s-%s-%s%s-%05d-%s",
                category.toUpperCase(),
                subcategory.toUpperCase(),
                material.toUpperCase(),
                plant.toUpperCase(),
                year,
                serial,
                revision.toUpperCase()
        );

        log.debug("Generated part number: {}", partNumber);
        return partNumber;
    }

    /**
     * Atomically increments the counter in the DB and returns the new value.
     * Always uses row id=1 (single-row table).
     */
    @Transactional
    public long getNextSerial() {
        PartCounter counter = counterRepository.findById(1L)
                .orElseGet(() -> {
                    // First ever run — create the counter row
                    log.info("Initializing part counter at {}", counterStart);
                    PartCounter newCounter = new PartCounter(1L, counterStart);
                    return counterRepository.save(newCounter);
                });

        counter.setCurrentValue(counter.getCurrentValue() + 1);
        counterRepository.save(counter);

        log.debug("Serial counter incremented to: {}", counter.getCurrentValue());
        return counter.getCurrentValue();
    }

    /**
     * Returns the current counter value without incrementing.
     */
    public long getCurrentCounter() {
        return counterRepository.findById(1L)
                .map(PartCounter::getCurrentValue)
                .orElse(counterStart);
    }
}
