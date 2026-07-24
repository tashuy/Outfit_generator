package com.outfit.recommendation.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        String driverClassName = properties.getDriverClassName();
        String username = properties.getUsername();
        String password = properties.getPassword();

        // Standardize PostgreSQL connection string if provided in postgresql:// or postgres:// URI format
        if (StringUtils.hasText(url) && (url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
            ParsedUrl parsed = parsePostgresUrl(url);
            url = parsed.jdbcUrl;
            if (!StringUtils.hasText(username) && parsed.username != null) {
                username = parsed.username;
            }
            if (!StringUtils.hasText(password) && parsed.password != null) {
                password = parsed.password;
            }
            if (!StringUtils.hasText(driverClassName) || driverClassName.contains("h2")) {
                driverClassName = "org.postgresql.Driver";
            }
        } else if (StringUtils.hasText(url) && (url.startsWith("jdbc:postgresql://") || url.startsWith("jdbc:postgres://"))) {
            ParsedUrl parsed = parseJdbcPostgresUrl(url);
            url = parsed.jdbcUrl;
            if (!StringUtils.hasText(username) && parsed.username != null) {
                username = parsed.username;
            }
            if (!StringUtils.hasText(password) && parsed.password != null) {
                password = parsed.password;
            }
            if (!StringUtils.hasText(driverClassName) || driverClassName.contains("h2")) {
                driverClassName = "org.postgresql.Driver";
            }
        }

        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .url(url)
                .username(username)
                .password(password)
                .driverClassName(driverClassName)
                .build();
    }

    public static class ParsedUrl {
        public final String jdbcUrl;
        public final String username;
        public final String password;

        public ParsedUrl(String jdbcUrl, String username, String password) {
            this.jdbcUrl = jdbcUrl;
            this.username = username;
            this.password = password;
        }
    }

    public static ParsedUrl parsePostgresUrl(String rawUrl) {
        try {
            String tempUrl = rawUrl.replaceFirst("^(postgresql|postgres)://", "http://");
            URI uri = new URI(tempUrl);

            String user = null;
            String pass = null;
            if (uri.getUserInfo() != null) {
                String[] userInfo = uri.getUserInfo().split(":", 2);
                user = userInfo[0];
                if (userInfo.length > 1) {
                    pass = userInfo[1];
                }
            }

            int port = uri.getPort();
            String host = uri.getHost();
            String path = uri.getPath();
            String query = uri.getQuery();

            StringBuilder jdbcBuilder = new StringBuilder("jdbc:postgresql://");
            if (host != null) {
                jdbcBuilder.append(host);
            }
            if (port != -1) {
                jdbcBuilder.append(":").append(port);
            }
            if (path != null) {
                jdbcBuilder.append(path);
            }
            if (query != null && !query.isEmpty()) {
                jdbcBuilder.append("?").append(query);
            }

            return new ParsedUrl(jdbcBuilder.toString(), user, pass);
        } catch (Exception e) {
            return new ParsedUrl(rawUrl.startsWith("jdbc:") ? rawUrl : "jdbc:" + rawUrl, null, null);
        }
    }

    public static ParsedUrl parseJdbcPostgresUrl(String rawUrl) {
        if (!rawUrl.contains("@")) {
            return new ParsedUrl(rawUrl, null, null);
        }

        String stripped = rawUrl.substring("jdbc:".length());
        return parsePostgresUrl(stripped);
    }
}
