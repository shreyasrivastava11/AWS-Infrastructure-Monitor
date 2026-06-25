package com.awsmonitor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretAccessKey}")
    private String secretAccessKey;

    @Value("${aws.region}")
    private String region;

    private StaticCredentialsProvider credentialsProvider() {
        return StaticCredentialsProvider.create(
            AwsBasicCredentials.create(accessKeyId, secretAccessKey)
        );
    }

    @Bean
    public Ec2Client ec2Client() {
        return Ec2Client.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider())
            .build();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider())
            .build();
    }

    @Bean
    public CloudWatchClient cloudWatchClient() {
        return CloudWatchClient.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider())
            .build();
    }
}
