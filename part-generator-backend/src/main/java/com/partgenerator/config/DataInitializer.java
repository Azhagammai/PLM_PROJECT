package com.partgenerator.config;

import com.partgenerator.model.Part;
import com.partgenerator.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataInitializer — seeds the database with sample parts on first run.
 * Skips if data already exists, so it is safe to restart the server.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PartRepository partRepository;

    @Override
    public void run(String... args) {
        if (partRepository.count() > 0) {
            log.info("Database already has data — skipping seed.");
            return;
        }

        log.info("Seeding sample parts into database...");

        partRepository.save(Part.builder()
                .partNumber("MECH-BODY-AL-MX26-10001-A")
                .description("Chassis Main Body Panel")
                .category("MECH").subcategory("BODY").material("AL").plant("MX").revision("A")
                .status(Part.PartStatus.RELEASED).owner("student6").quantity(142)
                .build());

        partRepository.save(Part.builder()
                .partNumber("ELEC-CONN-SS-DE26-10002-B")
                .description("High Voltage Connector Assembly")
                .category("ELEC").subcategory("CONN").material("SS").plant("DE").revision("B")
                .status(Part.PartStatus.IN_REVIEW).owner("student6").quantity(28)
                .build());

        partRepository.save(Part.builder()
                .partNumber("HYDR-PUMP-CR-TX26-10003-A")
                .description("Hydraulic Pump Unit 5L")
                .category("HYDR").subcategory("PUMP").material("CR").plant("TX").revision("A")
                .status(Part.PartStatus.RELEASED).owner("student6").quantity(9)
                .build());

        partRepository.save(Part.builder()
                .partNumber("STRC-BEAM-TI-CA26-10004-C")
                .description("Load Bearing Titanium Crossmember")
                .category("STRC").subcategory("BEAM").material("TI").plant("CA").revision("C")
                .status(Part.PartStatus.OBSOLETE).owner("student6").quantity(0)
                .build());

        partRepository.save(Part.builder()
                .partNumber("PNEU-VALV-PL-DE26-10005-A")
                .description("Pneumatic Check Valve 3/8 inch")
                .category("PNEU").subcategory("VALV").material("PL").plant("DE").revision("A")
                .status(Part.PartStatus.RELEASED).owner("student6").quantity(310)
                .build());

        partRepository.save(Part.builder()
                .partNumber("MECH-GEAR-SS-MX26-10006-B")
                .description("Bevel Gear Set 4:1 Ratio")
                .category("MECH").subcategory("GEAR").material("SS").plant("MX").revision("B")
                .status(Part.PartStatus.IN_REVIEW).owner("student6").quantity(55)
                .build());

        partRepository.save(Part.builder()
                .partNumber("ELEC-SENS-AL-TX26-10007-A")
                .description("Proximity Sensor 24V DC")
                .category("ELEC").subcategory("SENS").material("AL").plant("TX").revision("A")
                .status(Part.PartStatus.RELEASED).owner("student6").quantity(204)
                .build());

        partRepository.save(Part.builder()
                .partNumber("HYDR-FILT-RB-CA26-10008-A")
                .description("Hydraulic Return Line Filter")
                .category("HYDR").subcategory("FILT").material("RB").plant("CA").revision("A")
                .status(Part.PartStatus.RELEASED).owner("student6").quantity(76)
                .build());

        log.info("✅ Seeded 8 sample parts successfully.");
    }
}
