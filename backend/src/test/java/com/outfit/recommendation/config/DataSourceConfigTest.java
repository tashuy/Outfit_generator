package com.outfit.recommendation.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DataSourceConfigTest {

    @Test
    void testParsePostgresUrlWithCredentialsAndParams() {
        String neonUrl = "postgresql://neondb_owner:npg_GuUzJ2LBCd1X@ep-sweet-pond-az0646q3-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
        
        DataSourceConfig.ParsedUrl parsed = DataSourceConfig.parsePostgresUrl(neonUrl);
        
        assertEquals("jdbc:postgresql://ep-sweet-pond-az0646q3-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require", parsed.jdbcUrl);
        assertEquals("neondb_owner", parsed.username);
        assertEquals("npg_GuUzJ2LBCd1X", parsed.password);
    }

    @Test
    void testParsePostgresUrlShortScheme() {
        String url = "postgres://user:pass@localhost:5432/mydb";
        
        DataSourceConfig.ParsedUrl parsed = DataSourceConfig.parsePostgresUrl(url);
        
        assertEquals("jdbc:postgresql://localhost:5432/mydb", parsed.jdbcUrl);
        assertEquals("user", parsed.username);
        assertEquals("pass", parsed.password);
    }

    @Test
    void testParseJdbcPostgresUrlWithEmbeddedCredentials() {
        String url = "jdbc:postgresql://user:pass@localhost:5432/mydb?sslmode=require";
        
        DataSourceConfig.ParsedUrl parsed = DataSourceConfig.parseJdbcPostgresUrl(url);
        
        assertEquals("jdbc:postgresql://localhost:5432/mydb?sslmode=require", parsed.jdbcUrl);
        assertEquals("user", parsed.username);
        assertEquals("pass", parsed.password);
    }

    @Test
    void testParseJdbcPostgresUrlStandard() {
        String url = "jdbc:postgresql://localhost:5432/mydb";
        
        DataSourceConfig.ParsedUrl parsed = DataSourceConfig.parseJdbcPostgresUrl(url);
        
        assertEquals("jdbc:postgresql://localhost:5432/mydb", parsed.jdbcUrl);
        assertNull(parsed.username);
        assertNull(parsed.password);
    }
}
